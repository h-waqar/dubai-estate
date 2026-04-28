import "dotenv/config";
import { PrismaClient, Role, ProjectType, ProjectStatus, PropertyStatus, PropertyAvailability, ListingType, FurnishingStatus } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "shadow_agent_01@example.com";
  const hashedPassword = await bcrypt.hash("shadow123", 10);

  console.log(`🌱 Seeding Shadow Agent: ${email}...`);

  // 1. Create Shadow Agent
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      roles: { set: [Role.USER] },
    },
    create: {
      email,
      name: "Shadow Agent One",
      username: "shadow_agent_01",
      password: hashedPassword,
      roles: [Role.USER],
      pricingPlan: {
        connect: { slug: "silver" },
      },
    },
  });

  console.log(`✅ Shadow Agent created/updated with ID: ${user.id}`);

  // 2. Create sample Property 1
  const apartmentType = await prisma.propertyType.findUnique({ where: { slug: "apartment" } });
  if (apartmentType) {
    const prop1 = await prisma.property.upsert({
      where: { slug: "shadow-marina-loft" },
      update: {},
      create: {
        title: "Shadow Marina Loft",
        slug: "shadow-marina-loft",
        description: "A sleek loft with marina views for the shadow agent.",
        price: "1200000",
        propertyTypeId: apartmentType.id,
        listingType: ListingType.SALE,
        status: PropertyStatus.APPROVED,
        availability: PropertyAvailability.AVAILABLE,
        createdById: user.id,
        location: "Dubai Marina",
        bedrooms: 1,
        bathrooms: 1,
        builtUpArea: 850,
        furnishing: FurnishingStatus.FURNISHED,
      },
    });
    console.log(`✅ Property 1 created: ${prop1.slug}`);
  } else {
    console.warn("⚠️ Property Type 'apartment' not found. Run standard seed first.");
  }

  // 3. Create sample Property 2
  const villaType = await prisma.propertyType.findUnique({ where: { slug: "villa" } });
  if (villaType) {
    const prop2 = await prisma.property.upsert({
      where: { slug: "shadow-desert-villa" },
      update: {},
      create: {
        title: "Shadow Desert Villa",
        slug: "shadow-desert-villa",
        description: "Private oasis in the desert.",
        price: "4500000",
        propertyTypeId: villaType.id,
        listingType: ListingType.SALE,
        status: PropertyStatus.APPROVED,
        availability: PropertyAvailability.AVAILABLE,
        createdById: user.id,
        location: "Arabian Ranches",
        bedrooms: 4,
        bathrooms: 5,
        builtUpArea: 3500,
        furnishing: FurnishingStatus.UNFURNISHED,
      },
    });
    console.log(`✅ Property 2 created: ${prop2.slug}`);
  } else {
    console.warn("⚠️ Property Type 'villa' not found. Run standard seed first.");
  }

  // 4. Create sample Project
  const emaar = await prisma.developer.findUnique({ where: { slug: "emaar" } });
  if (emaar) {
    const proj1 = await prisma.project.upsert({
      where: { slug: "shadow-tower" },
      update: {},
      create: {
        name: "Shadow Tower",
        slug: "shadow-tower",
        description: "The ultimate off-plan project for shadow agents.",
        developerId: emaar.id,
        createdById: user.id,
        projectType: ProjectType.CURRENT,
        status: ProjectStatus.APPROVED,
        location: "Downtown Dubai",
        priceFrom: "2000000",
      },
    });
    console.log(`✅ Project created: ${proj1.slug}`);
  } else {
    console.warn("⚠️ Developer 'emaar' not found. Run standard seed first.");
  }

  console.log("✨ Shadow Agent seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
