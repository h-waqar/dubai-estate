// prisma/seed.ts
import { PrismaClient } from "@/generated/prisma";

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

  // Create developers
  const developers = [
    { name: "Emaar Properties", slug: "emaar-properties", website: "https://www.emaar.com" },
    { name: "Dubai Properties", slug: "dubai-properties" },
    { name: "Nakheel", slug: "nakheel", website: "https://www.nakheel.com" },
    { name: "Damac Properties", slug: "damac-properties", website: "https://www.damacproperties.com" },
    { name: "Sobha Realty", slug: "sobh a-realty", website: "https://www.sobharealty.com" },
    { name: "Meraas", slug: "meraas" },
    { name: "Select Group", slug: "select-group" },
    { name: "Azizi Developments", slug: "azizi-developments" },
  ];

  for (const developer of developers) {
    await prisma.developer.upsert({
      where: { slug: developer.slug },
      update: developer,
      create: developer,
    });
    console.log(`✅ Created/Updated developer: ${developer.name}`);
  }

  // Create project amenities
  const amenities = [
    { name: "Swimming Pool", icon: "waves", category: "Leisure" },
    { name: "Gym & Fitness Center", icon: "dumbbell", category: "Wellness" },
    { name: "Sauna & Steam Room", icon: "droplet", category: "Wellness" },
    { name: "Kids Play Area", icon: "baby", category: "Family" },
    { name: "BBQ Area", icon: "flame", category: "Leisure" },
    { name: "Landscaped Gardens", icon: "tree", category: "Outdoor" },
    { name: "24/7 Security", icon: "shield", category: "Security" },
    { name: "Covered Parking", icon: "car", category: "Parking" },
    { name: "Retail Outlets", icon: "shopping-bag", category: "Convenience" },
    { name: "Jogging Track", icon: "activity", category: "Wellness" },
    { name: "Yoga & Meditation Area", icon: "heart", category: "Wellness" },
    { name: "Concierge Service", icon: "user", category: "Service" },
  ];

  for (const amenity of amenities) {
    await prisma.projectAmenity.upsert({
      where: { name: amenity.name },
      update: amenity,
      create: amenity,
    });
    console.log(`✅ Created/Updated amenity: ${amenity.name}`);
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
