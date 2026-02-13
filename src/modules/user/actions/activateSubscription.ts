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
    if (!subDetails) {
      return { success: false, error: "Invalid PayPal Subscription ID" };
    }

    // 2. Determine Plan from PayPal Plan ID
    const paypalPlanId = subDetails.plan_id;
    
    // Find DB Plan by matching paypalPlanId
    // If not found by ID, try checking if it matches the env vars for legacy support
    const dbPlan = await prisma.pricingPlan.findFirst({
        where: {
            OR: [
                { paypalPlanId: paypalPlanId },
                { slug: paypalPlanId === process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD ? "gold" : undefined },
                { slug: paypalPlanId === process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER ? "silver" : undefined }
            ]
        }
    });

    if (!dbPlan) {
      return { success: false, error: `Unknown PayPal Plan ID: ${paypalPlanId}` };
    }

    // 3. Check for Coupon in custom_id
    let couponId: string | undefined;
    // Default price from plan
    let priceAtSubscription = dbPlan.priceMonthly ? new Prisma.Decimal(dbPlan.priceMonthly) : new Prisma.Decimal(0);

    if (subDetails.custom_id) {
        try {
            const customData = JSON.parse(subDetails.custom_id);
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

    // 4. Execute Ledger-First Transaction
    const result = await prisma.$transaction(async (tx) => {
        // A. Record Ledger Transaction
        // Extract payment info from subscription details
        // subDetails.billing_info.last_payment.amount.value
        // subDetails.billing_info.last_payment.time
        
        const lastPayment = subDetails.billing_info?.last_payment;
        if (!lastPayment) {
             throw new Error("Missing billing info or last payment details from PayPal");
        }

        const amountValue = lastPayment.amount?.value || "0";
        const currencyCode = lastPayment.amount?.currency_code || "USD";
        const paymentTime = lastPayment.time ? new Date(lastPayment.time) : new Date();
        // providerTxId: The instruction says "Prefer payment ID, fallback to subDetails.id".
        // PayPal subscription last_payment usually doesn't give a separate transaction ID in the simplified view?
        // Let's check what we get. If not, we might use subDetails.id + timestamp or just subDetails.id if it's the first payment?
        // Actually, for a subscription activation, it is usually the *first* payment.
        // However, using subDetails.id as providerTxId might conflict if we have recurring payments later?
        // The instructions say "Prefer payment ID, fallback to subDetails.id".
        // Assuming last_payment doesn't have an ID easily available in this type definition?
        // Let's assume we don't have a distinct tx ID in this object for now and use subDetails.id if needed, 
        // BUT strict adherence means we should try to find a unique ID. 
        // If we use subDetails.id, subsequent renewals might fail if they try to record with same ID?
        // But this is 'activateSubscription', implies initial set up.
        // Let's use `subDetails.id` for the *activation* event if no payment ID is present.
        // Ideally we would want the capture ID.
        // For now, let's follow instruction: "Prefer payment ID, fallback to subDetails.id"
        // I'll assume `lastPayment` might have an ID property or we use subDetails.id.
        // Since I don't see the type definition for `subDetails`, I'll use subDetails.id carefully. 
        // Wait, if I use subDetails.id, I should probably append something if it's not unique enough? 
        // "providerTxId -> Prefer payment ID, fallback to subDetails.id" - I will stick to this literal instruction.
        
        const providerTxId = (lastPayment as any).id || subDetails.id; 

        await ledgerService.recordTransaction(tx, {
            userId: session.user.id,
            type: TransactionType.PAYMENT,
            status: TransactionStatus.COMPLETED,
            amount: new Prisma.Decimal(amountValue),
            currency: currencyCode,
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
        let status: SubscriptionStatus = "PENDING";
        if (paypalStatus === "ACTIVE") status = "ACTIVE";
        else if (paypalStatus === "SUSPENDED") status = "SUSPENDED";
        else if (paypalStatus === "CANCELLED") status = "CANCELLED";
        else if (paypalStatus === "EXPIRED") status = "EXPIRED";

        const subscription = await tx.subscription.upsert({
            where: { paypalSubscriptionId },
            update: {
                status,
                planId: dbPlan.id,
                couponId: couponId,
                priceAtSubscription,
                nextBillingDate: subDetails.billing_info?.next_billing_time ? new Date(subDetails.billing_info.next_billing_time) : undefined,
            },
            create: {
                userId: session.user.id,
                planId: dbPlan.id,
                couponId: couponId,
                paypalSubscriptionId,
                status,
                priceAtSubscription,
                startDate: new Date(),
                nextBillingDate: subDetails.billing_info?.next_billing_time ? new Date(subDetails.billing_info.next_billing_time) : undefined,
            }
        });

        // D. Update User (if Active)
        if (status === "ACTIVE") {
            await tx.user.update({
                where: { id: session.user.id },
                data: {
                    pricingPlanId: dbPlan.id,
                    subscriptionStatus: "ACTIVE",
                    subscriptionId: subscription.id 
                }
            });

            // E. Grant Entitlements
            await EntitlementService.grant(
                session.user.id, 
                'PROPERTY_SLOT', 
                dbPlan.maxListings, 
                subscription.id,
                "SUBSCRIPTION",
                tx
            );
        }

        return { planName: dbPlan.name };
    });

    revalidatePath("/account");
    revalidatePath("/advertise");
    
    return { success: true, plan: result.planName };

  } catch (error: any) {
    console.error("Activation Error:", error);
    // Generic error to client, do not leak details
    return { success: false, error: "Failed to activate subscription. Please contact support." };
  }
}