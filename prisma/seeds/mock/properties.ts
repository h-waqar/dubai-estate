import { PrismaClient, ListingType, PropertyStatus, PropertyAvailability, FurnishingStatus } from "@prisma/client";

export async function seedProperties(prisma: PrismaClient) {
  console.log("⏳ Seeding Mock Properties...");

  const admin = await prisma.user.findFirst({
    where: { roles: { has: "SUPER_ADMIN" } },
  });
  
  const agent = await prisma.user.findFirst({
    where: { username: "john_agent" },
  });

  const shadowAgent = await prisma.user.findFirst({
    where: { username: "shadow_agent_01" },
  });

  if (!admin || !agent || !shadowAgent) {
    console.warn("   ⚠️ Admin, Agent or Shadow Agent not found, skipping properties.");
    return;
  }

  const apartmentType = await prisma.propertyType.findUnique({
    where: { slug: "apartment" },
  });

  const villaType = await prisma.propertyType.findUnique({
    where: { slug: "villa" },
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
          furnishing: FurnishingStatus.FURNISHED,
          features: {
            create: [
              { feature: { connect: { slug: "balcony" } } },
              { feature: { connect: { slug: "view-water" } } },
            ],
          },
        },
      });
      console.log("   ✅ Property: Luxury Marina Apt");
    }

    // Shadow Marina Loft
    const shadowLoft = await prisma.property.upsert({
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
        createdById: shadowAgent.id,
        location: "Dubai Marina",
        bedrooms: 1,
        bathrooms: 1,
        builtUpArea: 850,
        furnishing: FurnishingStatus.FURNISHED,
      },
    });
    console.log(`   ✅ Property: ${shadowLoft.slug}`);
  }

  if (villaType) {
    // Shadow Desert Villa
    const shadowVilla = await prisma.property.upsert({
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
        createdById: shadowAgent.id,
        location: "Arabian Ranches",
        bedrooms: 4,
        bathrooms: 5,
        builtUpArea: 3500,
        furnishing: FurnishingStatus.UNFURNISHED,
      },
    });
    console.log(`   ✅ Property: ${shadowVilla.slug}`);
  }
}
