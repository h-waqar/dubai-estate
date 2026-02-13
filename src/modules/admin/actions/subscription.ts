"use server";

import { prisma } from "@/lib/prisma";
import { getSubscriptionDetails, cancelSubscription, getSubscriptionTransactions, refundPayment } from "@/lib/paypal-api";
import { EntitlementService } from "@/modules/entitlement/entitlement.service";
import { revalidatePath } from "next/cache";

/**
 * Syncs the local DB status with PayPal's status
 */
export async function syncSubscriptionStatus(userId: number, subscriptionId: string) {
  try {
    const details = await getSubscriptionDetails(subscriptionId);
    const status = details.status; // ACTIVE, SUSPENDED, CANCELLED, EXPIRED

    // Update Subscription Record
    const updatedSub = await prisma.subscription.update({
      where: { paypalSubscriptionId: subscriptionId },
      data: { status: status as any },
    });

    if (status === "CANCELLED" || status === "EXPIRED" || status === "SUSPENDED") {
      await EntitlementService.revoke(updatedSub.id);
    }

    revalidatePath("/admin/subscribers");
    return { success: true, status };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Cancels a subscription
 */
export async function cancelUserSubscription(userId: number, subscriptionId: string) {
  try {
    await cancelSubscription(subscriptionId, "Admin cancelled via Dashboard");
    
    // Update Subscription Record
    const updatedSub = await prisma.subscription.update({
      where: { paypalSubscriptionId: subscriptionId },
      data: { 
        status: "CANCELLED",
        endDate: new Date() // Set end date to now
      },
    });

    // Revoke entitlements
    await EntitlementService.revoke(updatedSub.id);

    revalidatePath("/admin/subscribers");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get recent transactions for a subscription
 */
export async function listUserTransactions(subscriptionId: string) {
  try {
    // Default to last 90 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90); 

    const transactions = await getSubscriptionTransactions(
      subscriptionId, 
      startDate.toISOString(), 
      endDate.toISOString()
    );
    return { success: true, transactions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Refund a specific transaction
 */
export async function refundUserTransaction(captureId: string) {
  try {
    await refundPayment(captureId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
