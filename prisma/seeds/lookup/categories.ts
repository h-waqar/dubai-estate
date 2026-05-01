import { PrismaClient } from "@prisma/client";

export async function seedCategories(prisma: PrismaClient) {
  console.log("⏳ Seeding Categories...");
  const categories = [
    {
      name: "Market Trends",
      slug: "market-trends",
      color: "#3B82F6",
      icon: "trending-up",
    },
    {
      name: "Investment Guides",
      slug: "investment-guides",
      color: "#10B981",
      icon: "dollar-sign",
    },
    {
      name: "Community Spotlights",
      slug: "community-spotlights",
      color: "#F59E0B",
      icon: "map-pin",
    },
    {
      name: "Legal & Regulations",
      slug: "legal-regulations",
      color: "#EF4444",
      icon: "scale",
    },
    { name: "Lifestyle", slug: "lifestyle", color: "#8B5CF6", icon: "coffee" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    console.log(`   ✅ Category: ${category.name}`);
  }
}
