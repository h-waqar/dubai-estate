import "dotenv/config";
import { PrismaClient, PlanType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const definitions = [
    { name: "Featured Credit", code: "FEATURED_CREDIT", description: "1 credit for Featured promotion" },
    { name: "Spotlight Credit", code: "SPOTLIGHT_CREDIT", description: "1 credit for Spotlight promotion" },
    { name: "Bump Up Credit", code: "BUMP_UP_CREDIT", description: "1 credit for Bump Up action" },
  ];

  for (const def of definitions) {
    await prisma.entitlementDefinition.upsert({
      where: { code: def.code },
      update: def,
      create: def,
    });
  }

  const addonPlans = [
    {
      name: "Featured Addon",
      slug: "featured-addon",
      description: "Buy Featured credits",
      type: PlanType.ADDON,
      priceOneTime: "50",
      isActive: true,
      entitlements: [{ code: "FEATURED_CREDIT", amount: 1 }],
    },
    {
      name: "Spotlight Addon",
      slug: "spotlight-addon",
      description: "Buy Spotlight credits",
      type: PlanType.ADDON,
      priceOneTime: "100",
      isActive: true,
      entitlements: [{ code: "SPOTLIGHT_CREDIT", amount: 1 }],
    },
    {
      name: "Bump Up Addon",
      slug: "bump-up-addon",
      description: "Buy Bump Up credits",
      type: PlanType.ADDON,
      priceOneTime: "10",
      isActive: true,
      entitlements: [{ code: "BUMP_UP_CREDIT", amount: 1 }],
    },
  ];

  for (const planData of addonPlans) {
    const { entitlements, ...rest } = planData;
    const plan = await prisma.pricingPlan.upsert({
      where: { slug: rest.slug },
      update: rest,
      create: rest,
    });

    for (const ent of entitlements) {
      const definition = await prisma.entitlementDefinition.findUnique({ where: { code: ent.code } });
      if (definition) {
        await prisma.planEntitlement.upsert({
          where: { planId_definitionId: { planId: plan.id, definitionId: definition.id } },
          update: { amount: ent.amount },
          create: { planId: plan.id, definitionId: definition.id, amount: ent.amount },
        });
      }
    }
  }
}

main().catch(console.error);
