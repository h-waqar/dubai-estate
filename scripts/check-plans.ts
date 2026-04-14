import { prisma } from "../src/lib/prisma";

async function main() {
    const plans = await prisma.pricingPlan.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            paypalPlanId: true
        }
    });
    console.log("Pricing Plans:");
    console.log(JSON.stringify(plans, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
