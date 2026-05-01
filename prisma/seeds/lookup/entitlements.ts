import { PrismaClient } from "@prisma/client";

export async function seedEntitlements(prisma: PrismaClient) {
  console.log("⏳ Seeding Entitlement Definitions...");
  const entitlementDefs = [
    // Creation Rights (Slots)
    {
      name: "Property Slot",
      code: "PROPERTY_SLOT",
      description: "Allows creating one property listing",
      applicableTo: "PROPERTY",
    },
    {
      name: "Project Slot",
      code: "PROJECT_SLOT",
      description: "Allows creating one project listing",
      applicableTo: "PROJECT",
    },

    // Promotion Credits - Property
    { 
      name: "Featured Credit", 
      code: "FEATURED_CREDIT", 
      description: "1 credit for Featured promotion (Property)",
      applicableTo: "PROPERTY",
    },
    { 
      name: "Spotlight Credit", 
      code: "SPOTLIGHT_CREDIT", 
      description: "1 credit for Spotlight promotion (Property)",
      applicableTo: "PROPERTY",
    },
    { 
      name: "Bump Up Credit", 
      code: "BUMP_UP_CREDIT", 
      description: "1 credit for Bump Up action (Property)",
      applicableTo: "PROPERTY",
    },

    // Promotion Credits - Project
    {
      name: "Project Featured Credit",
      code: "PROJECT_FEATURED_CREDIT",
      description: "1 credit for Featured promotion (Project)",
      applicableTo: "PROJECT",
    },
    {
      name: "Project Spotlight Credit",
      code: "PROJECT_SPOTLIGHT_CREDIT",
      description: "1 credit for Spotlight promotion (Project)",
      applicableTo: "PROJECT",
    },
    {
      name: "Project Bump-up Credit",
      code: "PROJECT_BUMP_UP_CREDIT",
      description: "1 credit for Bump Up action (Project)",
      applicableTo: "PROJECT",
    },
  ];

  for (const def of entitlementDefs) {
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
    console.log(`   ✅ Entitlement Definition: ${def.code} (${def.applicableTo})`);
  }
}
