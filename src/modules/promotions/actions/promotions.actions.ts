"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { PromotionService } from "@/modules/promotions/services/promotion.service";
import { EntitlementService } from "@/modules/entitlement/entitlement.service";
import { revalidatePath } from "next/cache";
import { createAddonOrder, captureAddonOrder } from "@/lib/paypal-api";
import { prisma } from "@/lib/prisma";
import { Prisma, TransactionType, TransactionStatus, PromotionStatus, GrantStatus } from "@prisma/client";
import { ledgerService } from "@/modules/finance/ledger.service";

export async function activatePromotionAction(entityId: number, type: "SPOTLIGHT" | "FEATURED", entityType: "PROPERTY" | "PROJECT" = "PROPERTY") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  try {
    const userId = Number(session.user.id);
    await PromotionService.activatePromotion(entityId, type, entityType, userId);
    revalidatePath("/account/properties");
    revalidatePath("/account/projects");
    revalidatePath("/account");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to activate promotion" };
  }
}

export async function bumpUpPropertyAction(entityId: number, entityType: "PROPERTY" | "PROJECT" = "PROPERTY") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  try {
    const userId = Number(session.user.id);
    await PromotionService.bumpUpProperty(entityId, userId, entityType);
    revalidatePath("/account/properties");
    revalidatePath("/account/projects");
    revalidatePath("/properties");
    revalidatePath("/projects");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to bump up property" };
  }
}

export async function getCooldownStatusAction(entityId: number, entityType: "PROPERTY" | "PROJECT" = "PROPERTY") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  try {
    const userId = Number(session.user.id);
    const status = await PromotionService.getCooldownStatus(entityId, userId, entityType);
    return { success: true, status };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function syncPromotionStatusesAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  try {
    const userId = Number(session.user.id);
    await PromotionService.syncPromotionStatuses(userId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserEntitlementsAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  try {
    const userId = Number(session.user.id);
    
    // Fetch all active grants to build a dynamic breakdown
    const grants = await prisma.entitlementGrant.findMany({
      where: {
        userId,
        status: GrantStatus.ACTIVE,
      },
      include: {
        definition: true,
      },
    });

    const breakdown: Record<string, { total: number; used: number; sources: Record<string, number> }> = {};

    grants.forEach((grant) => {
      const code = grant.definition.code;
      if (!breakdown[code]) {
        breakdown[code] = { total: 0, used: 0, sources: {} };
      }
      breakdown[code].total += grant.amount;
      breakdown[code].used += grant.used;
      
      const source = grant.sourceType || "SUBSCRIPTION";
      breakdown[code].sources[source] = (breakdown[code].sources[source] || 0) + (grant.amount - grant.used);
    });

    // Also include PROPERTY_SLOT and PROJECT_SLOT specifically if not present
    const codes = [
      "FEATURED_CREDIT", "SPOTLIGHT_CREDIT", "BUMP_UP_CREDIT", 
      "PROJECT_FEATURED_CREDIT", "PROJECT_SPOTLIGHT_CREDIT", "PROJECT_BUMP_UP_CREDIT",
      "PROPERTY_SLOT", "PROJECT_SLOT"
    ];
    for (const code of codes) {
        if (!breakdown[code]) {
            breakdown[code] = { total: 0, used: 0, sources: {} };
        }
    }

    return { 
      success: true, 
      entitlements: breakdown
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getActivePromotionsAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  try {
    const userId = Number(session.user.id);
    const promotions = await prisma.promotion.findMany({
      where: {
        userId,
        status: PromotionStatus.ACTIVE,
      },
      include: {
        property: { select: { id: true, title: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { expiresAt: "asc" },
    });

    return { success: true, promotions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createAddonOrderAction(addonType: string, amount: string, qty: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  try {
    const userId = Number(session.user.id);

    // Security: Verify amount against DB configuration
    const plan = await prisma.pricingPlan.findUnique({ where: { slug: addonType } });
    if (!plan || !plan.priceOneTime) throw new Error("Invalid addon plan");

    const packs = await prisma.addonPack.findMany({ where: { isActive: true } });
    const pack = packs.find(p => p.qty === qty);
    const discount = pack ? Number(pack.discount) : 0;
    
    const basePrice = Number(plan.priceOneTime);
    const expectedAmount = (basePrice * qty * (1 - discount)).toFixed(2);

    // Use the server-calculated amount for security
    const order = await createAddonOrder(expectedAmount, "USD", { 
      userId, 
      addonType, 
      qty,
      amountCredits: qty 
    });
    return { success: true, orderId: order.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function captureAddonOrderAction(orderId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  const userId = Number(session.user.id);

  try {
    const result = await captureAddonOrder(orderId);
    
    // 1. Success Check
    if (result.status !== "COMPLETED") {
        return { success: false, error: `Payment status: ${result.status}` };
    }

    // 2. Extract Metadata (propagated from createOrder)
    const purchaseUnit = result.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];
    
    // Check multiple possible locations for custom_id
    const customId = purchaseUnit?.custom_id || capture?.custom_id;
    
    let metadata: any = {};
    try {
        if (customId) {
            metadata = JSON.parse(customId);
            console.log("[captureAddonOrderAction] Parsed metadata:", metadata);
        } else {
            console.warn("[captureAddonOrderAction] No custom_id found in PayPal response");
        }
    } catch (e) {
        console.warn("Failed to parse customId in captureAddonOrderAction", customId);
    }

    const addonType = metadata.addonType || "unknown";
    const amountCredits = metadata.amountCredits || metadata.qty || 1;
    const captureId = capture?.id || orderId;

    // 3. Local fulfillment (Ledger + Entitlements)
    await prisma.$transaction(async (tx) => {
        // Fetch plan first to get a good name for the ledger
        const plan = await tx.pricingPlan.findUnique({
            where: { slug: addonType },
            include: { entitlements: { include: { definition: true } } }
        });

        const displayName = plan?.name || (addonType !== "unknown" 
            ? addonType.split(/[-_]/).map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            : "Addon");
        
        const description = `${displayName} Purchase (${amountCredits} credits)`;
        
        const existingTx = await tx.ledgerTransaction.findUnique({
            where: { providerTxId: captureId }
        });

        if (!existingTx) {
            console.log(`[captureAddonOrderAction] Recording transaction: ${description} for user ${userId}`);
            await ledgerService.recordTransaction(tx, {
                userId,
                type: TransactionType.PAYMENT,
                status: TransactionStatus.COMPLETED,
                amount: new Prisma.Decimal(capture?.amount?.value || purchaseUnit?.amount?.value || "0"),
                currency: capture?.amount?.currency_code || purchaseUnit?.amount?.currency_code || "USD",
                description,
                provider: "PAYPAL",
                providerTxId: captureId,
                occurredAt: new Date(capture?.create_time || result.update_time || new Date()),
                metadata: result,
            });

            // Grant Entitlements
            if (plan && plan.entitlements.length > 0) {
                console.log(`[captureAddonOrderAction] Found plan ${plan.name}, granting ${plan.entitlements.length} types of entitlements`);
                for (const ent of plan.entitlements) {
                    await EntitlementService.grant(
                        userId,
                        ent.definition.code,
                        ent.amount * amountCredits,
                        captureId,
                        "ADDON",
                        tx
                    );
                }
            } else {
                // Fallback to manual mapping if plan not found or has no entitlements
                const addonToCode: Record<string, string> = {
                    featured: "FEATURED_CREDIT",
                    "featured-addon": "FEATURED_CREDIT",
                    spotlight: "SPOTLIGHT_CREDIT",
                    "spotlight-addon": "SPOTLIGHT_CREDIT",
                    bump_up: "BUMP_UP_CREDIT",
                    "bump-up-addon": "BUMP_UP_CREDIT",
                    "bumpup": "BUMP_UP_CREDIT",
                    "project-listing": "PROJECT_SLOT",
                    "project_listing": "PROJECT_SLOT",
                };
                const code = addonToCode[addonType.toLowerCase()];

                if (code) {
                    console.log(`[captureAddonOrderAction] Fallback grant: ${amountCredits} of ${code}`);
                    await EntitlementService.grant(
                        userId,
                        code,
                        amountCredits,
                        captureId,
                        "ADDON",
                        tx
                    );
                } else {
                    console.warn(`[captureAddonOrderAction] No plan or mapping found for addonType: ${addonType}`);
                }
            }
        }
    });

    revalidatePath("/account");
    return { success: true, result };
  } catch (error: any) {
    console.error("Capture Addon Error:", error);
    return { success: false, error: error.message };
  }
}
