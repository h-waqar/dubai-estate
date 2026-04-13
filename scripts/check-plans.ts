import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const plans = await prisma.pricingPlan.findMany({
    include: {
      entitlements: {
        include: {
          definition: true
        }
      }
    }
  });
  const definitions = await prisma.entitlementDefinition.findMany();
  
  console.log("=== PRICING PLANS ===");
  console.log(JSON.stringify(plans, null, 2));
  console.log("=== ENTITLEMENT DEFINITIONS ===");
  console.log(JSON.stringify(definitions, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
