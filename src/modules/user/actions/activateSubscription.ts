"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { getSubscriptionDetails } from "@/lib/paypal-api";
import { revalidatePath } from "next/cache";
import { SubscriptionStatus, Prisma, TransactionType, TransactionStatus } from "@prisma/client";
import { couponService } from "@/modules/coupon/coupon.service";
import { ledgerService } from "@/modules/finance/ledger.service";
import { EntitlementService } from "@/modules/entitlement/entitlement.service";

export async function activateSubscription(paypalSubscriptionId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // 1. Verify with PayPal
    const subDetails = await getSubscriptionDetails(paypalSubscriptionId);
    console.log("PayPal Subscription Details:", JSON.stringify(subDetails, null, 2));
    if (!subDetails) {
      return { success: false, error: "Invalid PayPal Subscription ID" };
    }

    // 2. Determine Plan from PayPal Plan ID
    const paypalPlanId = subDetails.plan_id;
    console.log("PayPal Plan ID:", paypalPlanId);
    
    // Find DB Plan by matching paypalPlanId
    // If not found by ID, try checking if it matches the env vars for legacy support
    const dbPlan = await prisma.pricingPlan.findFirst({
        where: {
            OR: [
                { paypalPlanId: paypalPlanId },
                { slug: paypalPlanId === process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD ? "gold" : undefined },
                { slug: paypalPlanId === process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER ? "silver" : undefined }
            ]
        },
        include: {
            entitlements: {
                include: {
                    definition: true
                }
            }
        }
    });

    if (!dbPlan) {
      console.error(`Unknown PayPal Plan ID: ${paypalPlanId}`);
      return { success: false, error: `Unknown PayPal Plan ID: ${paypalPlanId}` };
    }

    console.log("Matched DB Plan:", dbPlan.slug);

    // 3. Check for Coupon and User in custom_id
    let couponId: string | undefined;
    let targetUserId = session.user.id;

    // Default price from plan
    let priceAtSubscription = dbPlan.priceMonthly ? new Prisma.Decimal(dbPlan.priceMonthly) : new Prisma.Decimal(0);

    if (subDetails.custom_id) {
        try {
            const customData = JSON.parse(subDetails.custom_id);
            
            // Handle Potential User ID Mismatch (e.g. after DB Prune)
            if (customData.userId) {
                const paypalUserId = Number(customData.userId);
                if (paypalUserId !== targetUserId) {
                    const paypalUserExists = await prisma.user.findUnique({ 
                        where: { id: paypalUserId },
                        select: { id: true }
                    });
                    if (paypalUserExists) {
                        targetUserId = paypalUserId;
                    } else {
                        console.warn(`[activateSubscription] User ${paypalUserId} from PayPal custom_id not found. Falling back to session user ${targetUserId}`);
                    }
                }
            }

            if (customData.couponCode) {
                const coupon = await couponService.getCouponByCode(customData.couponCode);
                if (coupon) {
                    couponId = coupon.id;
                    // Note: We don't increment usage here anymore, we do it in the transaction below to be safe
                    
                    // Calculate discounted price
                    if (coupon.type === 'FIXED') {
                        priceAtSubscription = priceAtSubscription.minus(coupon.value);
                    } else if (coupon.type === 'PERCENTAGE') {
                        const discount = priceAtSubscription.mul(coupon.value).div(100);
                        priceAtSubscription = priceAtSubscription.minus(discount);
                    }
                    if (priceAtSubscription.lessThan(0)) priceAtSubscription = new Prisma.Decimal(0);
                }
            }
        } catch (e) {
            console.error("Failed to parse custom_id", e);
        }
    }

    // Verify target user exists before proceeding to transaction
    const finalUser = await prisma.user.findUnique({ 
        where: { id: targetUserId },
        select: { id: true }
    });
    if (!finalUser) {
        console.error(`[activateSubscription] Target user ${targetUserId} not found in database.`);
        return { success: false, error: "User account not found. Please log in again." };
    }

    // 4. Execute Ledger-First Transaction
    const result = await prisma.$transaction(async (tx) => {
        // A. Record Ledger Transaction
        // Extract payment info from subscription details
        // subDetails.billing_info.last_payment.amount.value
        // subDetails.billing_info.last_payment.time
        
        const lastPayment = subDetails.billing_info?.last_payment;
        // RELAXED CHECK: In some cases (like PayPal Sandbox or immediate redirects), 
        // last_payment might be delayed or missing. We proceed with defaults if status is ACTIVE.
        
        const amountValue = lastPayment?.amount?.value || "0";
        const currencyCode = lastPayment?.amount?.currency_code || "USD";
        const paymentTime = lastPayment?.time ? new Date(lastPayment.time) : new Date();
        const providerTxId = (lastPayment as any)?.id || subDetails.id; 

        await ledgerService.recordTransaction(tx, {
            userId: targetUserId,
            type: TransactionType.PAYMENT,
            status: TransactionStatus.COMPLETED,
            amount: new Prisma.Decimal(amountValue),
            currency: currencyCode,
            description: `${dbPlan.name} Subscription`,
            provider: "PAYPAL",
            providerTxId: providerTxId,
            occurredAt: paymentTime,
            metadata: subDetails as any
        });

        // B. Update Coupon Usage if applicable
        if (couponId) {
             await tx.coupon.update({
                where: { id: couponId },
                data: { usedCount: { increment: 1 } }
            });
        }

        // C. Upsert Subscription
        const paypalStatus = subDetails.status; 
        if (paypalStatus !== "ACTIVE") {
             throw new Error(`Subscription status is ${paypalStatus}, not ACTIVE.`);
        }

        const status: SubscriptionStatus = "ACTIVE";

        const subscription = await tx.subscription.upsert({
            where: { paypalSubscriptionId },
            update: {
                status,
                planId: dbPlan.id,
                userId: targetUserId,
                couponId: couponId,
                priceAtSubscription,
                nextBillingDate: subDetails.billing_info?.next_billing_time ? new Date(subDetails.billing_info.next_billing_time) : undefined,
            },
            create: {
                userId: targetUserId,
                planId: dbPlan.id,
                couponId: couponId,
                paypalSubscriptionId,
                status,
                priceAtSubscription,
                startDate: new Date(),
                nextBillingDate: subDetails.billing_info?.next_billing_time ? new Date(subDetails.billing_info.next_billing_time) : undefined,
            }
        });

        // D. Update User (Confirmed Active)
        if (status === "ACTIVE") {
            await tx.user.update({
                where: { id: targetUserId },
                data: {
                    pricingPlanId: dbPlan.id,
                    subscriptionStatus: "ACTIVE",
                    subscriptionId: subscription.id 
                }
            });

            // E. Grant Entitlements
            for (const ent of dbPlan.entitlements) {
              await EntitlementService.grant(
                  targetUserId, 
                  ent.definition.code, 
                  ent.amount, 
                  subscription.id,
                  "SUBSCRIPTION",
                  tx
              );
            }
        }

        return { planName: dbPlan.name };
    });

    revalidatePath("/account");
    revalidatePath("/advertise/property");
    revalidatePath("/advertise/projects");
    
    return { success: true, plan: result.planName };

  } catch (error: any) {
    console.error("Activation Error:", JSON.stringify({ message: error.message, stack: error.stack, code: error.code }, null, 2));
    // Generic error to client, do not leak details
    return { success: false, error: "Failed to activate subscription. Please contact support." };
  }
}