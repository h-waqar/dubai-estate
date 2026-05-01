import { PrismaClient } from "@prisma/client";

export async function seedPropertyTypes(prisma: PrismaClient) {
  console.log("⏳ Seeding Property Types...");
  const propertyTypes = [
    {
      name: "Apartment",
      slug: "apartment",
      description: "Residential flats and apartments",
    },
    { name: "Villa", slug: "villa", description: "Standalone houses" },
    { name: "Townhouse", slug: "townhouse", description: "Terraced housing" },
    {
      name: "Penthouse",
      slug: "penthouse",
      description: "Luxury top-floor units",
    },
    { name: "Office", slug: "office", description: "Commercial office space" },
    { name: "Plot", slug: "plot", description: "Land for development" },
  ];

  for (const type of propertyTypes) {
    await prisma.propertyType.upsert({
      where: { slug: type.slug },
      update: type,
      create: type,
    });
    console.log(`   ✅ Property Type: ${type.name}`);
  }
}
