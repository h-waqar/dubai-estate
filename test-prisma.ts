import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  try {
    const entitlements = [
      { definitionId: "cm6uik4s0000a6clik02nzh0y", amount: 1 },
      { definitionId: "cm6uik4s0000a6clik02nzh0z", amount: 1 },
      { definitionId: "cm6uik4s0000a6clik02nzh0x", amount: 1 }
    ];

    const data = {
        name: "Grand Scheme Planning " + Date.now(),
        slug: "grand-scheme-planning-" + Date.now(),
        description: "This is just a test plan to test out the new Grant Schema",
        type: "SUBSCRIPTION",
        priceMonthly: "125",
        priceYearly: "100",
        priceOneTime: "0",
        isActive: true,
        paypalPlanId: "",
        paypalProductId: "",
        entitlements: {
          create: entitlements.map(e => ({
            definitionId: e.definitionId,
            amount: e.amount
          }))
        }
    };

    const res = await prisma.pricingPlan.create({ data: data as any });
    console.log("Success:", res);
  } catch (err) {
    console.error("FAIL:", err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
