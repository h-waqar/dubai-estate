import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plans = await prisma.pricingPlan.findMany({
    select: {
      id: true,
      name: true,
      paypalPlanId: true,
    },
  });
  console.log(JSON.stringify(plans, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
