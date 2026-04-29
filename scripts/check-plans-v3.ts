import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    const plans = await prisma.pricingPlan.findMany();
    console.log("Pricing Plans:");
    plans.forEach(p => {
      console.log(`- ${p.name} (${p.type}): id=${p.id}, paypalPlanId=${p.paypalPlanId}, slug=${p.slug}`);
    });
  } catch (e) {
    console.error("Database error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
