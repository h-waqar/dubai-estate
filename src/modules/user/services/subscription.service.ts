import { prisma } from "@/lib/prisma";
import { SubscriptionStatus, SystemStatus } from "@prisma/client";
import { EntitlementService } from "@/modules/entitlement/entitlement.service";

export class SubscriptionService {
  /**
   * Handle subscription renewal (e.g., from recurring payment webhook)
   */
  static async renew(paypalSubscriptionId: string, tx: any = prisma) {
    const subscription = await tx.subscription.findUnique({
      where: { paypalSubscriptionId },
      include: { user: true },
    });

    if (!subscription) {
      throw new Error(`Subscription with PayPal ID ${paypalSubscriptionId} not found`);
    }

    // Update subscription status to ACTIVE (if it wasn't already)
    // and potentially update nextBillingDate if we have it (though usually it's updated on activation/previous payment)
    const updatedSub = await tx.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.ACTIVE,
      },
    });

    // Ensure user is active and has correct plan
    await tx.user.update({
      where: { id: subscription.userId },
      data: {
        subscriptionStatus: "ACTIVE",
        pricingPlanId: subscription.planId,
      },
    });

    // Governance: Ensure properties are ACTIVE
    await tx.property.updateMany({
      where: { createdById: subscription.userId },
      data: { systemStatus: SystemStatus.ACTIVE },
    });
    
    await tx.project.updateMany({
      where: { createdById: subscription.userId },
      data: { systemStatus: SystemStatus.ACTIVE },
    });

    return updatedSub;
  }

  /**
   * Handle subscription cancellation or expiration
   */
  static async cancel(paypalSubscriptionId: string, tx: any = prisma) {
    return this.updateStatus(paypalSubscriptionId, SubscriptionStatus.CANCELLED, tx);
  }

  /**
   * Handle subscription past due status
   */
  static async markPastDue(paypalSubscriptionId: string, tx: any = prisma) {
    // Note: SubscriptionStatus enum might not have PAST_DUE, checking schema...
    // enum SubscriptionStatus { ACTIVE SUSPENDED CANCELLED EXPIRED PENDING }
    // Let's use SUSPENDED for past due or add PAST_DUE to enum if needed.
    // The plan says PAST_DUE, but schema has SUSPENDED. I'll use SUSPENDED.
    return this.updateStatus(paypalSubscriptionId, SubscriptionStatus.SUSPENDED, tx);
  }

  /**
   * Internal helper to handle status transitions and revocation logic
   */
  private static async updateStatus(
    paypalSubscriptionId: string,
    status: SubscriptionStatus,
    tx: any = prisma
  ) {
    const subscription = await tx.subscription.findUnique({
      where: { paypalSubscriptionId },
    });

    if (!subscription) {
      throw new Error(`Subscription with PayPal ID ${paypalSubscriptionId} not found`);
    }

    const updatedSub = await tx.subscription.update({
      where: { id: subscription.id },
      data: { status },
    });

    // If status is not ACTIVE, revoke entitlements and update governance
    if (status !== SubscriptionStatus.ACTIVE) {
      // 1. Revoke Entitlements
      await EntitlementService.revoke(subscription.id, tx);

      // 2. Governance: Mark listings as INACTIVE_BILLING
      await tx.property.updateMany({
        where: { createdById: subscription.userId },
        data: { systemStatus: SystemStatus.INACTIVE_BILLING },
      });

      await tx.project.updateMany({
        where: { createdById: subscription.userId },
        data: { systemStatus: SystemStatus.INACTIVE_BILLING },
      });

      // 3. Update User Status
      await tx.user.update({
        where: { id: subscription.userId },
        data: { subscriptionStatus: status },
      });
    }

    return updatedSub;
  }
}
