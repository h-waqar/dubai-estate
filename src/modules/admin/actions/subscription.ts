"use server";

import { prisma } from "@/lib/prisma";
import { getSubscriptionDetails, cancelSubscription, getSubscriptionTransactions, refundPayment } from "@/lib/paypal-api";
import { EntitlementService } from "@/modules/entitlement/entitlement.service";
import { revalidatePath } from "next/cache";
import { serializeDecimals } from "@/lib/serializeDecimal";

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
 * Get recent transactions for a user
 */
export async function listUserTransactions(userId: number) {
  try {
    const transactions = await prisma.ledgerTransaction.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
      take: 20
    });
    
    return { 
        success: true, 
        transactions: serializeDecimals(transactions)
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Refund a specific transaction and record in Ledger
 */
export async function refundUserTransaction(captureId: string) {
  try {
    // 1. Process Refund with PayPal
    await refundPayment(captureId);

    // 2. Find original transaction to get details
    const originalTx = await prisma.ledgerTransaction.findUnique({
      where: { providerTxId: captureId }
    });

    if (originalTx) {
        // 3. Record Refund in Ledger
        await prisma.ledgerTransaction.create({
            data: {
                userId: originalTx.userId,
                type: 'REFUND',
                status: 'COMPLETED',
                amount: originalTx.amount, // Record same amount as negative or just value? 
                // In ledger, usually we record amount. 
                // Since it's type REFUND, it implies money leaving.
                currency: originalTx.currency,
                provider: "PAYPAL",
                providerTxId: `REFUND_${captureId}_${Date.now()}`,
                occurredAt: new Date(),
                metadata: { original_tx: captureId }
            }
        });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
