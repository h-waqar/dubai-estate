"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { getSubscriptionDetails } from "@/lib/paypal-api";
import { revalidatePath } from "next/cache";
import { SubscriptionStatus } from "@/generated/prisma/index.js";

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
        // Update dates if available
        nextBillingDate: subDetails.billing_info?.next_billing_time ? new Date(subDetails.billing_info.next_billing_time) : undefined,
      },
      create: {
        userId: session.user.id,
        planId: dbPlan.id,
        paypalSubscriptionId,
        status,
        priceAtSubscription: dbPlan.priceMonthly || 0,
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
