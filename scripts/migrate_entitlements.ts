import "dotenv/config";
import { PrismaClient, SubscriptionStatus, GrantStatus } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Starting Entitlement Backfill...");

  // 1. Fetch all ACTIVE subscriptions with their plans
  const activeSubscriptions = await prisma.subscription.findMany({
    where: {
      status: SubscriptionStatus.ACTIVE,
    },
    include: {
      plan: true,
      user: true,
    },
  });

  console.log(`Found ${activeSubscriptions.length} active subscriptions.`);

  const propertySlotDef = await prisma.entitlementDefinition.findUnique({
    where: { code: "PROPERTY_SLOT" },
  });

  if (!propertySlotDef) {
    throw new Error("PROPERTY_SLOT definition not found. Run seed first.");
  }

  // We need to track how many properties we've "accounted for" in used counts
  const userPropertyCounts = new Map<number, number>();

  for (const sub of activeSubscriptions) {
    console.log(`Processing user ${sub.userId} (${sub.user.email})...`);

    // Get total properties if not already fetched
    if (!userPropertyCounts.has(sub.userId)) {
      const count = await prisma.property.count({
        where: { createdById: sub.userId },
      });
      userPropertyCounts.set(sub.userId, count);
      console.log(`  User has ${count} total properties.`);
    }

    // Check if grant already exists for this subscription
    const existingGrant = await prisma.entitlementGrant.findFirst({
      where: {
        sourceId: sub.id,
        definitionId: propertySlotDef.id,
      },
    });

    if (existingGrant) {
      console.log(`  ⚠️ Grant already exists for subscription ${sub.id}. skipping.`);
      continue;
    }

    const totalProperties = userPropertyCounts.get(sub.userId) || 0;
    
    // We need to figure out how many were ALREADY assigned to PREVIOUS grants for this user in THIS script run
    // But since we are creating them one by one, let's just see how many we can fit in this one.
    // This is a bit tricky if we run it multiple times.
    // Let's just find out how many 'used' slots are already recorded in ACTIVE grants for this user.
    const alreadyUsed = await prisma.entitlementGrant.aggregate({
        where: {
            userId: sub.userId,
            status: GrantStatus.ACTIVE,
            definitionId: propertySlotDef.id
        },
        _sum: { used: true }
    });

    const usedSoFar = alreadyUsed._sum.used || 0;
    const remainingToAssign = Math.max(0, totalProperties - usedSoFar);
    const assignedUsed = Math.min(remainingToAssign, sub.plan.maxListings);

    // Create grant
    await prisma.entitlementGrant.create({
      data: {
        userId: sub.userId,
        definitionId: propertySlotDef.id,
        amount: sub.plan.maxListings,
        used: assignedUsed,
        sourceId: sub.id,
        sourceType: "SUBSCRIPTION",
        status: GrantStatus.ACTIVE,
      },
    });

    console.log(`  ✅ Granted ${sub.plan.maxListings} property slots (Used: ${assignedUsed}).`);
  }

  console.log("✨ Backfill completed!");
}

main()
  .catch((e) => {
    console.error("❌ Backfill failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
