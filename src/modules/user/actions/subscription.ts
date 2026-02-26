"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { cancelSubscription, getSubscriptionTransactions } from "@/lib/paypal-api";
import { EntitlementService } from "@/modules/entitlement/entitlement.service";
import { SubscriptionService } from "@/modules/user/services/subscription.service";
import { sendEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { serializeDecimals } from "@/lib/serializeDecimal";

export async function getUserSubscriptionDetails() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  // Fetch all subscriptions for the user
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      subscriptions: {
        include: {
          plan: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
  return user?.subscriptions || [];
}

export async function cancelMySubscription(subscriptionId?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  // If no ID passed, try to find the active one (legacy behavior support or primary)
  let sub = null;
  if (subscriptionId) {
    sub = await prisma.subscription.findUnique({
        where: { id: subscriptionId, userId: session.user.id } // Ensure ownership
    });
  } else {
    // Find active one
    sub = await prisma.subscription.findFirst({
        where: { userId: session.user.id, status: 'ACTIVE' }
    });
  }

  if (!sub?.paypalSubscriptionId) return { success: false, error: "No active subscription found" };

  try {
    await cancelSubscription(sub.paypalSubscriptionId, "User requested cancellation via Dashboard");
    
    // Use SubscriptionService for consistent automation (Entitlements, Governance)
    await SubscriptionService.cancel(sub.paypalSubscriptionId);

    revalidatePath("/account/subscriptions");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to cancel subscription" };
  }
}

export async function requestRefundAction(subscriptionId: string, reason: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) return { success: false, error: "Unauthorized" };

  const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId, userId: session.user.id },
    include: { plan: true }
  });

  if (!sub) return { success: false, error: "Subscription not found" };

  // Send Email to Support
  const supportEmail = process.env.SUPPORT_EMAIL || "admin@dubaiestatetest.com";
  const subject = `Refund Request: ${session.user.email}`;
  const html = `
    <h2>Refund Request</h2>
    <p><strong>User:</strong> ${session.user.name} (${session.user.email})</p>
    <p><strong>Subscription ID:</strong> ${sub.paypalSubscriptionId}</p>
    <p><strong>Plan:</strong> ${sub.plan?.name}</p>
    <p><strong>Reason:</strong> ${reason}</p>
    <br/>
    <p>Please review this request in the Admin Dashboard.</p>
  `;

  await sendEmail({ to: supportEmail, subject, html });
  
  return { success: true };
}

export async function getMyTransactions() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  // Fetch local payment history from the Ledger
  const transactions = await prisma.ledgerTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { occurredAt: 'desc' },
  });

  return { success: true, transactions: serializeDecimals(transactions) };
}
