"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { PromotionService } from "@/modules/promotions/services/promotion.service";
import { EntitlementService } from "@/modules/entitlement/entitlement.service";
import { revalidatePath } from "next/cache";
import { createAddonOrder, captureAddonOrder } from "@/lib/paypal-api";
import { prisma } from "@/lib/prisma";

export async function activatePromotionAction(propertyId: number, type: "SPOTLIGHT" | "FEATURED") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  try {
    const userId = Number(session.user.id);
    await PromotionService.activatePromotion(propertyId, type, "PROPERTY", userId);
    revalidatePath("/account/properties");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to activate promotion" };
  }
}

export async function bumpUpPropertyAction(propertyId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  try {
    const userId = Number(session.user.id);
    await PromotionService.bumpUpProperty(propertyId, userId, "PROPERTY");
    revalidatePath("/account/properties");
    revalidatePath("/properties");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to bump up property" };
  }
}

export async function getCooldownStatusAction(propertyId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  try {
    const userId = Number(session.user.id);
    const status = await PromotionService.getCooldownStatus(propertyId, userId, "PROPERTY");
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
    const featured = await EntitlementService.getQuotaStatus(userId, "FEATURED_CREDIT");
    const spotlight = await EntitlementService.getQuotaStatus(userId, "SPOTLIGHT_CREDIT");
    const bumpUp = await EntitlementService.getQuotaStatus(userId, "BUMP_UP_CREDIT");
    return { 
      success: true, 
      entitlements: {
        FEATURED: featured.totalCapacity - featured.totalUsed,
        SPOTLIGHT: spotlight.totalCapacity - spotlight.totalUsed,
        BUMP_UP: bumpUp.totalCapacity - bumpUp.totalUsed
      }
    };
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
  try {
    const result = await captureAddonOrder(orderId);
    return { success: true, result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
