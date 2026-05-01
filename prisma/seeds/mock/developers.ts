import { PrismaClient } from "@prisma/client";

export async function seedDevelopers(prisma: PrismaClient) {
  console.log("⏳ Seeding Developers...");
  const developers = [
    {
      name: "Emaar Properties",
      slug: "emaar",
      website: "https://www.emaar.com",
    },
    {
      name: "Damac Properties",
      slug: "damac",
      website: "https://www.damacproperties.com",
    },
    { name: "Nakheel", slug: "nakheel", website: "https://www.nakheel.com" },
    {
      name: "Sobha Realty",
      slug: "sobha",
      website: "https://www.sobharealty.com",
    },
    { name: "Dubai Properties", slug: "dubai-properties" },
  ];

  for (const developer of developers) {
    await prisma.developer.upsert({
      where: { slug: developer.slug },
      update: { ...developer, status: "APPROVED" },
      create: { ...developer, status: "APPROVED" },
    });
    console.log(`   ✅ Developer: ${developer.name}`);
  }
}
