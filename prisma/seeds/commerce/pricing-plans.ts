import { PrismaClient, PlanType } from "@prisma/client";

export async function seedPricingPlans(prisma: PrismaClient) {
  console.log("⏳ Seeding Pricing Plans...");
  
  // Fix potential slug conflicts (e.g. "Silver Package" having slug "silver-package" vs "silver")
  const slugMappings = {
    "Silver Package": "silver",
    "Gold Package": "gold",
    "Project Listing": "project-listing",
  };

  for (const [name, targetSlug] of Object.entries(slugMappings)) {
    const existing = await prisma.pricingPlan.findUnique({ where: { name } });
    if (existing && existing.slug !== targetSlug) {
      console.log(
        `⚠️ Renaming slug for "${name}" from "${existing.slug}" to "${targetSlug}"`,
      );
      await prisma.pricingPlan.update({
        where: { id: existing.id },
        data: { slug: targetSlug },
      });
    }
  }

  const plans = [
    {
      name: "Silver Package",
      slug: "silver",
      description: "Standard visibility for agents.",
      type: PlanType.SUBSCRIPTION,
      sortOrder: 10,
      priceMonthly: "10",
      priceYearly: "100",
      priceOneTime: "0",
      isActive: true,
      paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER,
      entitlements: [
        { code: "PROPERTY_SLOT", amount: 10 },
        { code: "FEATURED_CREDIT", amount: 1 },
      ],
    },
    {
      name: "Gold Package",
      slug: "gold",
      description: "Premium visibility and more listings.",
      type: PlanType.SUBSCRIPTION,
      sortOrder: 20,
      priceMonthly: "25",
      priceYearly: "250",
      priceOneTime: "0",
      isActive: true,
      paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD,
      entitlements: [
        { code: "PROPERTY_SLOT", amount: 50 },
        { code: "FEATURED_CREDIT", amount: 5 },
      ],
    },
    {
      name: "Project Listing",
      slug: "project-listing",
      description: "One-time fee for listing a project.",
      type: PlanType.ONE_TIME,
      sortOrder: 0,
      priceMonthly: "0",
      priceYearly: "0",
      priceOneTime: "100",
      isActive: true,
      entitlements: [
        { code: "PROJECT_SLOT", amount: 1 },
        { code: "PROJECT_FEATURED_CREDIT", amount: 1 },
      ],
    },
  ];

  for (const planData of plans) {
    const { entitlements, ...rest } = planData;
    const plan = await prisma.pricingPlan.upsert({
      where: { slug: rest.slug },
      update: rest,
      create: rest,
    });
    console.log(`   ✅ Plan: ${plan.name}`);

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
