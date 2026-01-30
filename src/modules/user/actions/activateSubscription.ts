"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { getSubscriptionDetails } from "@/lib/paypal-api";
import { revalidatePath } from "next/cache";
import { SubscriptionStatus, Prisma } from "@prisma/client";
import { couponService } from "@/modules/coupon/coupon.service";

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
    let priceAtSubscription = dbPlan.priceMonthly ? new Prisma.Decimal(dbPlan.priceMonthly) : new Prisma.Decimal(0);

    if (subDetails.custom_id) {
        try {
            const customData = JSON.parse(subDetails.custom_id);
            if (customData.couponCode) {
                const coupon = await couponService.getCouponByCode(customData.couponCode);
                if (coupon) {
                    couponId = coupon.id;
                    // Increment usage
                    await prisma.coupon.update({
                        where: { id: coupon.id },
                        data: { usedCount: { increment: 1 } }
                    });

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

    // 4. Upsert Subscription
    // Status mapping
    const paypalStatus = subDetails.status; // ACTIVE, APPROVAL_PENDING, etc.
    let status: SubscriptionStatus = "PENDING";
    if (paypalStatus === "ACTIVE") status = "ACTIVE";
    else if (paypalStatus === "SUSPENDED") status = "SUSPENDED";
    else if (paypalStatus === "CANCELLED") status = "CANCELLED";
    else if (paypalStatus === "EXPIRED") status = "EXPIRED";

    const subscription = await prisma.subscription.upsert({
      where: { paypalSubscriptionId },
      update: {
        status,
        planId: dbPlan.id,
        couponId: couponId, // Update coupon if changed (e.g. from pending to active with coupon)
        priceAtSubscription, // Update price if it was calculated differently
        // Update dates if available
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

    // 5. Update User (if Active)
    if (status === "ACTIVE") {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          pricingPlanId: dbPlan.id,
          subscriptionStatus: "ACTIVE",
          subscriptionId: subscription.id // Legacy field, keeping in sync
        }
      });
    }

    revalidatePath("/account");
    revalidatePath("/advertise");
    
    return { success: true, plan: dbPlan.name };

  } catch (error: any) {
    console.error("Activation Error:", error);
    return { success: false, error: error.message || "Failed to activate subscription" };
  }
}
