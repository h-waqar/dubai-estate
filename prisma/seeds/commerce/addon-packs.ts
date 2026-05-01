import { PrismaClient } from "@prisma/client";

export async function seedAddonPacks(prisma: PrismaClient) {
  console.log("⏳ Seeding Addon Packs...");

  const addonSlugs = [
    "featured-addon",
    "spotlight-addon",
    "bump-up-addon",
    "project-featured-addon",
    "project-spotlight-addon",
    "project-bump-up-addon",
  ];

  for (const slug of addonSlugs) {
    const plan = await prisma.pricingPlan.findUnique({ where: { slug } });

    if (!plan) {
      console.warn(`   ⚠️ Plan not found for addon pack: ${slug}`);
      continue;
    }

    const packs = [
      {
        planId: plan.id,
        qty: 1,
        label: "Single Unit",
        discount: 0,
        order: 1,
      },
      {
        planId: plan.id,
        qty: 5,
        label: "5-Pack Starter",
        discount: 10, // 10% discount
        order: 2,
      },
      {
        planId: plan.id,
        qty: 10,
        label: "10-Pack Professional",
        discount: 20, // 20% discount
        order: 3,
      },
    ];

    for (const pack of packs) {
      await prisma.addonPack.upsert({
        where: {
          // AddonPack doesn't have a unique constraint on (planId, qty) in schema.prisma
          // We'll use a find-then-create/update approach or just recreate them if needed.
          // Since it's a small table, we'll try to match by planId and qty.
          id: (await prisma.addonPack.findFirst({
            where: { planId: plan.id, qty: pack.qty }
          }))?.id || -1
        },
        update: pack,
        create: pack,
      });
    }
    console.log(`   ✅ Packs seeded for: ${slug}`);
  }
}
