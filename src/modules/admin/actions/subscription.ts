"use server";

import { prisma } from "@/lib/prisma";
import { getSubscriptionDetails, cancelSubscription, getSubscriptionTransactions, refundPayment } from "@/lib/paypal-api";
import { revalidatePath } from "next/cache";

/**
 * Syncs the local DB status with PayPal's status
 */
export async function syncSubscriptionStatus(userId: number, subscriptionId: string) {
  try {
    const details = await getSubscriptionDetails(subscriptionId);
    const status = details.status; // ACTIVE, SUSPENDED, CANCELLED, EXPIRED

    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: status },
    });

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
    
    // Update local DB
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: "CANCELLED" },
    });

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
