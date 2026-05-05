import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Import lookup seeds
import { seedAdmin } from "./seeds/lookup/admin";
import { seedEntitlements } from "./seeds/lookup/entitlements";
import { seedRoles } from "./seeds/lookup/roles";
import { seedPropertyTypes } from "./seeds/lookup/property-types";
import { seedCategories } from "./seeds/lookup/categories";
import { seedAmenities } from "./seeds/lookup/amenities";
import { seedFeatures } from "./seeds/lookup/features";

// Import commerce seeds
import { seedPricingPlans } from "./seeds/commerce/pricing-plans";
import { seedAddonPlans } from "./seeds/commerce/addon-plans";
import { seedAddonPacks } from "./seeds/commerce/addon-packs";

// Import mock seeds
import { seedDevelopers } from "./seeds/mock/developers";
import { seedUsers } from "./seeds/mock/users";
import { seedProjects } from "./seeds/mock/projects";
import { seedProperties } from "./seeds/mock/properties";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const isProduction = process.env.NODE_ENV === "production";
  
  console.log(`🌱 Seeding database in ${isProduction ? "PRODUCTION" : "DEVELOPMENT"} mode...`);

  try {
    // 1. Mandatory Lookups (Safe for all environments)
    await seedAdmin(prisma);
    await seedRoles(prisma);
    await seedEntitlements(prisma);
    await seedPropertyTypes(prisma);
    await seedCategories(prisma);
    await seedAmenities(prisma);
    await seedFeatures(prisma);

    // 2. Commerce / Plans
    await seedPricingPlans(prisma);
    await seedAddonPlans(prisma);
    await seedAddonPacks(prisma);

    // 3. Environment-specific seeds
    if (!isProduction) {
      console.log("🧪 Seeding mock data for development...");
      await seedDevelopers(prisma);
      await seedUsers(prisma);
      await seedProjects(prisma);
      await seedProperties(prisma);
    } else {
      console.log("🚀 Skipping mock data in production.");
    }

    console.log("✨ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
