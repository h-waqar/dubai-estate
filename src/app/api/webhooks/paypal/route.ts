import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paypal-api";
import { ledgerService } from "@/modules/finance/ledger.service";
import { EntitlementService } from "@/modules/entitlement/entitlement.service";
import { SubscriptionService } from "@/modules/user/services/subscription.service";
import { prisma } from "@/lib/prisma";
import { TransactionStatus, TransactionType, Prisma } from "@prisma/client";

const WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

export async function POST(req: NextRequest) {
  if (!WEBHOOK_ID) {
    console.error("PAYPAL_WEBHOOK_ID is not configured");
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  const body = await req.json();
  const headers = Object.fromEntries(req.headers.entries());

  // 1. Verify Signature
  const isValid = await verifyWebhookSignature(WEBHOOK_ID, headers, body);

  if (!isValid) {
    console.error("Invalid PayPal Webhook Signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const eventType = body.event_type;
  const resource = body.resource;

  console.log(`Received PayPal Webhook: ${eventType}`);

  try {
    switch (eventType) {
      case "PAYMENT.CAPTURE.COMPLETED": {
        console.log(`[Webhook:PAYMENT.CAPTURE.COMPLETED] Processing resource: ${resource.id}`);
        const customId = resource.custom_id;
        if (!customId) {
          console.warn(`[Webhook:PAYMENT.CAPTURE.COMPLETED] No custom_id found in resource ${resource.id}`);
          break;
        }

        let metadata;
        try {
          metadata = JSON.parse(customId);
          console.log(`[Webhook:PAYMENT.CAPTURE.COMPLETED] Parsed metadata:`, metadata);
        } catch (e) {
          console.error("Failed to parse customId in PAYMENT.CAPTURE.COMPLETED", customId);
          break;
        }

        const { userId, addonType, amountCredits } = metadata;
        if (!userId || !addonType) {
          console.error(`[Webhook:PAYMENT.CAPTURE.COMPLETED] Missing userId (${userId}) or addonType (${addonType})`);
          break;
        }

        const description = `${addonType.charAt(0).toUpperCase() + addonType.slice(1)} Addon Purchase (${amountCredits || 1} credits)`;

        // Verify user exists to avoid P2003 Foreign Key violation (e.g. after DB prune)
        const userExists = await prisma.user.findUnique({ 
          where: { id: Number(userId) },
          select: { id: true } 
        });
        if (!userExists) {
          console.error(`[Webhook:PAYMENT.CAPTURE.COMPLETED] User ${userId} not found in database. Skipping transaction.`);
          break;
        }

        await prisma.$transaction(async (tx) => {
          const existingTransaction = await tx.ledgerTransaction.findUnique({
            where: { providerTxId: resource.id },
          });

          if (existingTransaction) {
            console.log(`Transaction ${resource.id} already processed. Skipping.`);
            return;
          }

          console.log(`[Webhook:PAYMENT.CAPTURE.COMPLETED] Recording transaction for user ${userId}...`);
          await ledgerService.recordTransaction(tx, {
            userId: Number(userId),
            type: TransactionType.PAYMENT,
            status: TransactionStatus.COMPLETED,
            amount: new Prisma.Decimal(resource.amount.value),
            currency: resource.amount.currency_code,
            description,
            provider: "PAYPAL",
            providerTxId: resource.id,
            occurredAt: new Date(resource.create_time),
            metadata: body,
          });

          const addonToCode: Record<string, string> = {
            featured: "FEATURED_CREDIT",
            "featured-addon": "FEATURED_CREDIT",
            spotlight: "SPOTLIGHT_CREDIT",
            "spotlight-addon": "SPOTLIGHT_CREDIT",
            bump_up: "BUMP_UP_CREDIT",
            "bump-up-addon": "BUMP_UP_CREDIT",
          };
          const code = addonToCode[addonType.toLowerCase()];

          if (code) {
            console.log(`[Webhook:PAYMENT.CAPTURE.COMPLETED] Granting ${amountCredits || 1} credits of type ${code} to user ${userId}...`);
            await EntitlementService.grant(
              Number(userId),
              code,
              amountCredits || 1,
              resource.id,
              "ADDON",
              tx
            );
          } else {
            console.warn(`[Webhook:PAYMENT.CAPTURE.COMPLETED] No entitlement code found for addonType: ${addonType}`);
          }
        });
        console.log(`[Webhook:PAYMENT.CAPTURE.COMPLETED] Successfully processed resource ${resource.id}`);
        break;
      }

      case "PAYMENT.SALE.COMPLETED": {
        // Recurring payment or initial payment completed
        const subscriptionId = resource.billing_agreement_id;
        if (!subscriptionId) break;

        // Record in Ledger
        await prisma.$transaction(async (tx) => {
          // Find the subscription to get the userId
          const sub = await tx.subscription.findUnique({
            where: { paypalSubscriptionId: subscriptionId },
            include: { plan: true },
          });

          if (!sub) {
            console.error(`Subscription ${subscriptionId} not found for payment event`);
            return;
          }

          await ledgerService.recordTransaction(tx, {
            userId: sub.userId,
            type: TransactionType.PAYMENT,
            status: TransactionStatus.COMPLETED,
            amount: new Prisma.Decimal(resource.amount.total),
            currency: resource.amount.currency,
            description: `${sub.plan?.name || "Plan"} Subscription Renewal`,
            provider: "PAYPAL",
            providerTxId: resource.id, // Sale/Capture ID
            occurredAt: new Date(resource.create_time),
            metadata: body,
          });

          // Renew subscription (Extends validity/Sets ACTIVE)
          await SubscriptionService.renew(subscriptionId, tx);
        });
        break;
      }

      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.EXPIRED": {
        const subscriptionId = resource.id;
        await prisma.$transaction(async (tx) => {
           const sub = await tx.subscription.findUnique({
            where: { paypalSubscriptionId: subscriptionId },
          });

          if (!sub) return;

          await ledgerService.recordTransaction(tx, {
            userId: sub.userId,
            type: TransactionType.INFO,
            status: TransactionStatus.COMPLETED,
            amount: new Prisma.Decimal(0),
            currency: sub.currency,
            provider: "PAYPAL",
            providerTxId: `STATUS_CHANGE_${resource.id}_${Date.now()}`,
            occurredAt: new Date(body.create_time),
            metadata: { event: eventType, original_event: body },
          });
          
          await SubscriptionService.cancel(subscriptionId, tx);
        });
        break;
      }

      case "PAYMENT.SALE.DENIED": {
        const subscriptionId = resource.billing_agreement_id;
        if (!subscriptionId) break;

        await prisma.$transaction(async (tx) => {
           const sub = await tx.subscription.findUnique({
            where: { paypalSubscriptionId: subscriptionId },
          });

          if (!sub) return;

          await ledgerService.recordTransaction(tx, {
            userId: sub.userId,
            type: TransactionType.PAYMENT,
            status: TransactionStatus.FAILED,
            amount: new Prisma.Decimal(resource.amount.total),
            currency: resource.amount.currency,
            provider: "PAYPAL",
            providerTxId: resource.id,
            occurredAt: new Date(resource.create_time),
            metadata: body,
          });

          await SubscriptionService.markPastDue(subscriptionId, tx);
        });
        break;
      }
      
      case "BILLING.SUBSCRIPTION.SUSPENDED": {
        const subscriptionId = resource.id;
        await SubscriptionService.markPastDue(subscriptionId);
        break;
      }

      default:
        console.log(`Unhandled PayPal event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
