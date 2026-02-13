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
      description: "Allows the user to list a property.",
    },
    {
      code: "PROJECT_SLOT",
      description: "Allows the user to list a project.",
    },
    {
      code: "FEATURED_BOOST",
      description: "Allows the user to feature a listing.",
    },
  ];

  for (const def of definitions) {
    await prisma.entitlementDefinition.upsert({
      where: { code: def.code },
      update: def,
      create: def,
    });
    console.log(`✅ Entitlement Definition: ${def.code}`);
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
