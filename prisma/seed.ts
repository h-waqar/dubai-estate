// prisma/seed.ts
import "dotenv/config"; // LOAD ENV FIRST
import {
  PrismaClient,
  Role,
  PlanType,
  PropertyStatus,
  PropertyAvailability,
  ListingType,
  ProjectType,
  ProjectStatus,
  UnitType,
  ContactMethod,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // --- 0. Entitlement Definitions ---
  const entitlementDefs = [
    {
      name: "Property Slot",
      code: "PROPERTY_SLOT",
      description: "Allows creating one property listing",
    },
    {
      name: "Project Slot",
      code: "PROJECT_SLOT",
      description: "Allows creating one project listing",
    },
    {
      name: "Property Feature Slot",
      code: "PROPERTY_FEATURE_SLOT",
      description: "Allows featuring a property listing",
    },
    {
      name: "Project Feature Slot",
      code: "PROJECT_FEATURE_SLOT",
      description: "Allows featuring a project listing",
    },
    { 
      name: "Featured Credit", 
      code: "FEATURED_CREDIT", 
      description: "1 credit for Featured promotion" 
    },
    { 
      name: "Spotlight Credit", 
      code: "SPOTLIGHT_CREDIT", 
      description: "1 credit for Spotlight promotion" 
    },
    { 
      name: "Bump Up Credit", 
      code: "BUMP_UP_CREDIT", 
      description: "1 credit for Bump Up action" 
    },
  ];

  for (const def of entitlementDefs) {
    await prisma.entitlementDefinition.upsert({
      where: { code: def.code },
      update: def,
      create: def,
    });
    console.log(`✅ Entitlement Definition: ${def.code}`);
  }

  console.log("Prisma keys:", Object.keys(prisma));
  // Fix potential slug conflicts (e.g. "Silver Package" having slug "silver-package" vs "silver")
  const slugMappings = {
    "Silver Package": "silver",
    "Gold Package": "gold",
    "Project Listing": "project-listing",
    "Featured Addon": "featured-addon",
    "Spotlight Addon": "spotlight-addon",
    "Bump Up Addon": "bump-up-addon",
  };

  for (const [name, targetSlug] of Object.entries(slugMappings)) {
    const existing = await prisma.pricingPlan.findUnique({ where: { name } });
    if (existing && existing.slug !== targetSlug) {
      console.log(
        `⚠️ Renaming slug for "${name}" from "${existing.slug}" to "${targetSlug}"`,
      );
      await prisma.pricingPlan.update({
        where: { id: existing.id },
        data: { slug: targetSlug },
      });
    }
  }

  const plans = [
    {
      name: "Silver Package",
      slug: "silver",
      description: "Standard visibility for agents.",
      type: PlanType.SUBSCRIPTION,
      rank: 10,
      priceMonthly: "10",
      priceYearly: "100",
      priceOneTime: "0",
      isActive: true,
      paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER,
      entitlements: [
        { code: "PROPERTY_SLOT", amount: 10 },
        { code: "PROPERTY_FEATURE_SLOT", amount: 1 },
      ],
    },
    {
      name: "Gold Package",
      slug: "gold",
      description: "Premium visibility and more listings.",
      type: PlanType.SUBSCRIPTION,
      rank: 20,
      priceMonthly: "25",
      priceYearly: "250",
      priceOneTime: "0",
      isActive: true,
      paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD,
      entitlements: [
        { code: "PROPERTY_SLOT", amount: 50 },
        { code: "PROPERTY_FEATURE_SLOT", amount: 5 },
      ],
    },
    {
      name: "Project Listing",
      slug: "project-listing",
      description: "One-time fee for listing a project.",
      type: PlanType.ONE_TIME,
      rank: 0,
      priceMonthly: "0",
      priceYearly: "0",
      priceOneTime: "100",
      isActive: true,
      entitlements: [
        { code: "PROJECT_SLOT", amount: 1 },
        { code: "PROJECT_FEATURE_SLOT", amount: 1 },
      ],
    },
    {
      name: "Featured Addon",
      slug: "featured-addon",
      description: "Buy Featured credits",
      type: PlanType.ADDON,
      priceOneTime: "50",
      isActive: true,
      entitlements: [{ code: "FEATURED_CREDIT", amount: 1 }],
    },
    {
      name: "Spotlight Addon",
      slug: "spotlight-addon",
      description: "Buy Spotlight credits",
      type: PlanType.ADDON,
      priceOneTime: "100",
      isActive: true,
      entitlements: [{ code: "SPOTLIGHT_CREDIT", amount: 1 }],
    },
    {
      name: "Bump Up Addon",
      slug: "bump-up-addon",
      description: "Buy Bump Up credits",
      type: PlanType.ADDON,
      priceOneTime: "10",
      isActive: true,
      entitlements: [{ code: "BUMP_UP_CREDIT", amount: 1 }],
    },
  ];

  for (const planData of plans) {
    const { entitlements, ...rest } = planData;
    const plan = await prisma.pricingPlan.upsert({
      where: { slug: rest.slug },
      update: rest,
      create: rest,
    });
    console.log(`✅ Plan: ${plan.name}`);

    // Create entitlements
    for (const ent of entitlements) {
      // Find the definition ID by code
      const definition = await prisma.entitlementDefinition.findUnique({
        where: { code: ent.code },
      });

      if (definition) {
        await prisma.planEntitlement.upsert({
          where: {
            planId_definitionId: {
              planId: plan.id,
              definitionId: definition.id,
            },
          },
          update: { amount: ent.amount },
          create: {
            planId: plan.id,
            definitionId: definition.id,
            amount: ent.amount,
          },
        });
        console.log(`   └─ ✅ Entitlement: ${ent.code} (${ent.amount})`);
      } else {
        console.warn(`   └─ ⚠️ Definition not found: ${ent.code}`);
      }
    }
  }

  // --- 2. Users ---
  // Admin
  const adminEmail = "admin@test.com";
  const adminUsername = "super_admin";
  const hashedPassword = await bcrypt.hash("1122", 10);

  // Remove any user with the same username but different email to avoid unique constraint errors
  await prisma.user.deleteMany({
    where: {
      username: adminUsername,
      NOT: { email: adminEmail },
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      username: adminUsername,
      emailVerified: new Date(),
    },
    create: {
      email: adminEmail,
      name: "Super Admin",
      username: adminUsername,
      roles: [Role.SUPER_ADMIN],
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Admin User: ${admin.email}`);

  // Agent
  const agentEmail = "agent@test.com";
  const agentUsername = "john_agent";
  const hashedAgentPassword = await bcrypt.hash("1122", 10);

  // Remove any user with the same username but different email to avoid unique constraint errors
  await prisma.user.deleteMany({
    where: {
      username: agentUsername,
      NOT: { email: agentEmail },
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: agentEmail },
    update: {
      password: hashedAgentPassword,
      username: agentUsername,
      emailVerified: new Date(),
    },
    create: {
      email: agentEmail,
      name: "John Agent",
      username: agentUsername,
      roles: [Role.USER],
      password: hashedAgentPassword,
      emailVerified: new Date(),
      pricingPlan: {
        connect: { slug: "gold" },
      },
    },
  });
  console.log(`✅ Agent User: ${agent.email}`);

  // --- 3. Categories (Blog) ---
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
    console.log(`✅ Category: ${category.name}`);
  }

  // --- 4. Developers ---
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
    console.log(`✅ Developer: ${developer.name}`);
  }

  // --- 5. Project Amenities ---
  const projectAmenities = [
    { name: "Infinity Pool", icon: "waves", category: "Leisure" },
    { name: "State-of-the-art Gym", icon: "dumbbell", category: "Wellness" },
    { name: "Private Beach Access", icon: "umbrella", category: "Leisure" },
    { name: "Kids Club", icon: "baby", category: "Family" },
    { name: "Concierge", icon: "user", category: "Service" },
    { name: "Valet Parking", icon: "car", category: "Service" },
  ];

  for (const amenity of projectAmenities) {
    await prisma.projectAmenity.upsert({
      where: { name: amenity.name },
      update: amenity,
      create: amenity,
    });
    console.log(`✅ Project Amenity: ${amenity.name}`);
  }

  // --- 6. Property Types ---
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
    console.log(`✅ Property Type: ${type.name}`);
  }

  // --- 7. Property Features (Amenities) ---
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
    console.log(`✅ Property Feature: ${feature.name}`);
  }

  // --- 8. Projects (Dummy Data) ---
  const emaar = await prisma.developer.findUnique({ where: { slug: "emaar" } });
  if (emaar) {
    const existingProject = await prisma.project.findUnique({
      where: { slug: "creek-waters" },
    });
    if (!existingProject) {
      await prisma.project.create({
        data: {
          name: "Creek Waters",
          slug: "creek-waters",
          description: "Luxury living on Creek Island.",
          developerId: emaar.id,
          createdById: admin.id,
          projectType: ProjectType.CURRENT,
          status: ProjectStatus.APPROVED,
          isFeatured: true,
          published: true,
          publishedAt: new Date(),
          location: "Dubai Creek Harbour",
          priceFrom: "1500000",
          amenities: {
            connect: [{ name: "Infinity Pool" }, { name: "Concierge" }],
          },
        },
      });
      console.log("✅ Project: Creek Waters");
    }
  }

  // --- 9. Properties (Dummy Data) ---
  const apartmentType = await prisma.propertyType.findUnique({
    where: { slug: "apartment" },
  });
  if (apartmentType) {
    const existingProperty = await prisma.property.findUnique({
      where: { slug: "luxury-marina-apt" },
    });
    if (!existingProperty) {
      await prisma.property.create({
        data: {
          title: "Luxury 2BR Apartment with Marina View",
          slug: "luxury-marina-apt",
          description: "Stunning views of the Dubai Marina. Fully furnished.",
          price: "2500000",
          currency: "AED",
          propertyTypeId: apartmentType.id,
          listingType: ListingType.SALE,
          status: PropertyStatus.APPROVED,
          availability: PropertyAvailability.AVAILABLE,
          published: true,
          publishedAt: new Date(),
          createdById: agent.id,
          approvedById: admin.id,
          location: "Dubai Marina",
          bedrooms: 2,
          bathrooms: 3,
          builtUpArea: 1200,
          furnishing: "FURNISHED",
          features: {
            create: [
              { feature: { connect: { slug: "balcony" } } },
              { feature: { connect: { slug: "view-water" } } },
            ],
          },
        },
      });
      console.log("✅ Property: Luxury Marina Apt");
    }
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
