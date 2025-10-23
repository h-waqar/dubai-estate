// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories = [
    {
      name: "Technology",
      slug: "technology",
      description: "Tech news, tutorials, and insights",
      color: "#3B82F6",
      icon: "💻",
    },
    {
      name: "Design",
      slug: "design",
      description: "UI/UX design, graphics, and creativity",
      color: "#8B5CF6",
      icon: "🎨",
    },
    {
      name: "Business",
      slug: "business",
      description: "Business strategies and entrepreneurship",
      color: "#10B981",
      icon: "💼",
    },
    {
      name: "Lifestyle",
      slug: "lifestyle",
      description: "Health, fitness, and life tips",
      color: "#F59E0B",
      icon: "🌟",
    },
    {
      name: "Development",
      slug: "development",
      description: "Programming and software development",
      color: "#EF4444",
      icon: "⚡",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    console.log(`✅ Created/Updated category: ${category.name}`);
  }

  console.log("✨ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
