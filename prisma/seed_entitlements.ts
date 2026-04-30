import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Entitlement Definitions...");

  const definitions = [
    {
      code: "PROPERTY_SLOT",
      name: "Property Slot",
      description: "Allows the user to list a property.",
      applicableTo: "PROPERTY",
    },
    {
      code: "PROJECT_SLOT",
      name: "Project Slot",
      description: "Allows the user to list a project.",
      applicableTo: "PROJECT",
    },
    {
      code: "SPOTLIGHT_CREDIT",
      name: "Spotlight Credit",
      description: "Top-tier visibility for properties.",
      applicableTo: "PROPERTY",
    },
    {
      code: "FEATURED_CREDIT",
      name: "Featured Credit",
      description: "Enhanced visibility for properties.",
      applicableTo: "PROPERTY",
    },
    {
      code: "BUMP_UP_CREDIT",
      name: "Bump-up Credit",
      description: "Push properties back to the top.",
      applicableTo: "PROPERTY",
    },
    {
      code: "PROJECT_SPOTLIGHT_CREDIT",
      name: "Project Spotlight Credit",
      description: "Top-tier visibility for projects.",
      applicableTo: "PROJECT",
    },
    {
      code: "PROJECT_FEATURED_CREDIT",
      name: "Project Featured Credit",
      description: "Enhanced visibility for projects.",
      applicableTo: "PROJECT",
    },
    {
      code: "PROJECT_BUMP_UP_CREDIT",
      name: "Project Bump-up Credit",
      description: "Push projects back to the top.",
      applicableTo: "PROJECT",
    },
  ];

  for (const def of definitions) {
    await prisma.entitlementDefinition.upsert({
      where: { code: def.code },
      update: {
        name: def.name,
        description: def.description,
        applicableTo: def.applicableTo as any,
      },
      create: {
        code: def.code,
        name: def.name,
        description: def.description,
        applicableTo: def.applicableTo as any,
      },
    });
    console.log(`✅ Entitlement Definition: ${def.code} (${def.applicableTo})`);
  }

  console.log("✨ Entitlement Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
