import { PrismaClient, PlanType } from "@prisma/client";

export async function seedAddonPlans(prisma: PrismaClient) {
  console.log("⏳ Seeding Addon Plans...");

  const addonPlans = [
    // Property Addons
    {
      name: "Featured Addon (Property)",
      slug: "featured-addon",
      description: "Buy Featured credits for property listings",
      type: PlanType.ADDON,
      priceOneTime: "50",
      isActive: true,
      entitlements: [{ code: "FEATURED_CREDIT", amount: 1 }],
    },
    {
      name: "Spotlight Addon (Property)",
      slug: "spotlight-addon",
      description: "Buy Spotlight credits for property listings",
      type: PlanType.ADDON,
      priceOneTime: "100",
      isActive: true,
      entitlements: [{ code: "SPOTLIGHT_CREDIT", amount: 1 }],
    },
    {
      name: "Bump Up Addon (Property)",
      slug: "bump-up-addon",
      description: "Buy Bump Up credits for property listings",
      type: PlanType.ADDON,
      priceOneTime: "10",
      isActive: true,
      entitlements: [{ code: "BUMP_UP_CREDIT", amount: 1 }],
    },

    // Project Addons
    {
      name: "Featured Addon (Project)",
      slug: "project-featured-addon",
      description: "Buy Featured credits for project listings",
      type: PlanType.ADDON,
      priceOneTime: "150",
      isActive: true,
      entitlements: [{ code: "PROJECT_FEATURED_CREDIT", amount: 1 }],
    },
    {
      name: "Spotlight Addon (Project)",
      slug: "project-spotlight-addon",
      description: "Buy Spotlight credits for project listings",
      type: PlanType.ADDON,
      priceOneTime: "300",
      isActive: true,
      entitlements: [{ code: "PROJECT_SPOTLIGHT_CREDIT", amount: 1 }],
    },
    {
      name: "Bump Up Addon (Project)",
      slug: "project-bump-up-addon",
      description: "Buy Bump Up credits for project listings",
      type: PlanType.ADDON,
      priceOneTime: "30",
      isActive: true,
      entitlements: [{ code: "PROJECT_BUMP_UP_CREDIT", amount: 1 }],
    },
  ];

  for (const planData of addonPlans) {
    const { entitlements, ...rest } = planData;
    const plan = await prisma.pricingPlan.upsert({
      where: { slug: rest.slug },
      update: rest,
      create: rest,
    });
    console.log(`   ✅ Addon Plan: ${plan.name} (${plan.slug})`);

    // Create entitlements
    for (const ent of entitlements) {
      const definition = await prisma.entitlementDefinition.findUnique({
        where: { code: ent.code },
      });

      if (definition) {
        await prisma.planEntitlement.upsert({
          where: {
            planId_definitionId: {
              planId: plan.id,
              definitionId: definition.id,
            },
          },
          update: { amount: ent.amount },
          create: {
            planId: plan.id,
            definitionId: definition.id,
            amount: ent.amount,
          },
        });
        console.log(`      └─ ✅ Entitlement: ${ent.code} (${ent.amount})`);
      } else {
        console.warn(`      └─ ⚠️ Definition not found: ${ent.code}`);
      }
    }
  }
}
