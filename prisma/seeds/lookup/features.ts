import { PrismaClient } from "@prisma/client";

export async function seedFeatures(prisma: PrismaClient) {
  console.log("⏳ Seeding Property Features...");
  const propertyFeatures = [
    { name: "Balcony", slug: "balcony", category: "Outdoor", icon: "wind" },
    {
      name: "Central A/C",
      slug: "central-ac",
      category: "Indoor",
      icon: "thermometer",
    },
    {
      name: "Private Pool",
      slug: "private-pool",
      category: "Outdoor",
      icon: "droplet",
    },
    {
      name: "Shared Gym",
      slug: "shared-gym",
      category: "Wellness",
      icon: "dumbbell",
    },
    {
      name: "Maid's Room",
      slug: "maids-room",
      category: "Indoor",
      icon: "home",
    },
    {
      name: "View of Water",
      slug: "view-water",
      category: "View",
      icon: "eye",
    },
    {
      name: "Pets Allowed",
      slug: "pets-allowed",
      category: "Rules",
      icon: "dog",
    },
  ];

  for (const feature of propertyFeatures) {
    await prisma.feature.upsert({
      where: { slug: feature.slug },
      update: feature,
      create: feature,
    });
    console.log(`   ✅ Property Feature: ${feature.name}`);
  }
}
