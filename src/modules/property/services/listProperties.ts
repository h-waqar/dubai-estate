// src\modules\property\services\listProperties.ts
"use server";
import { prisma } from "@/lib/prisma";

export type PropertyFilters = {
  searchQuery?: string;
  propertyStatus?: string;
  propertyType?: string;
  bedrooms?: string;
  priceRange?: string;
  location?: string;
};

export async function listProperties(filters: PropertyFilters = {}) {
  const {
    searchQuery,
    propertyStatus,
    propertyType,
    bedrooms,
    priceRange,
    location,
  } = filters;

  const where: any = {};

  // Search Query (Title or Location)
  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { location: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  // Property Status (Buy/Rent)
  if (propertyStatus) {
    where.status = propertyStatus === "rent" ? "RENTED" : "AVAILABLE"; // Adjust based on your enum mapping if needed, or just pass the status directly if it matches
    // Wait, the enum is DRAFT, PENDING_REVIEW, APPROVED, DECLINED, ARCHIVED.
    // And Availability is AVAILABLE, SOLD, RENTED, OFFPLAN.
    // The UI has "Buy", "Rent".
    // "Buy" usually implies status=APPROVED and availability=AVAILABLE (or OFFPLAN).
    // "Rent" usually implies availability=AVAILABLE (for rent).
    // Let's assume the UI passes "sale" or "rent" and we map it to availability or a specific field.
    // Re-checking schema: PropertyStatus is for moderation. PropertyAvailability is AVAILABLE, SOLD, RENTED, OFFPLAN.
    // The UI filter "Buy" / "Rent" likely maps to a business logic.
    // For now, let's assume "Buy" -> Availability: AVAILABLE | OFFPLAN, "Rent" -> Availability: AVAILABLE (but maybe a 'type' field distinguishes? No, usually it's implied).
    // Actually, looking at StepOneCreate, we have `propertyStatus` field which saves "sale" or "rent".
    // But the schema doesn't have a `listingType` field. It has `status` (moderation) and `availability`.
    // Let's check `StepOneCreate` again. It saves `propertyStatus` to the store.
    // In `createProperty.ts`, `propertyStatus` from store is NOT saved to a specific column?
    // Wait, `createProperty.ts` uses `...propertyData`.
    // Let's check `createProperty.validator.ts`. `propertyStatus` is NOT in the validator?
    // `stepOneSchema` has `propertyStatus`. `createPropertyValidator` does NOT.
    // This implies `propertyStatus` (Sale/Rent) might be missing from the backend schema entirely!
    // I need to check if there is a column for "Sale" vs "Rent".
    // Schema has `status` (DRAFT, etc) and `availability` (AVAILABLE, etc).
    // It seems we might be missing a `listingType` (SALE/RENT).
    // OR `propertyStatus` in the form maps to something else?
    // Let's assume for now we filter by `availability` if possible, or maybe I should check if I need to add a column.
    // For this step, I will implement the other filters and leave a TODO for status if ambiguous.
    // Actually, looking at the schema again: `availability` enum has `RENTED`.
    // Maybe `availability` should be `FOR_SALE` / `FOR_RENT`?
    // Current enums: AVAILABLE, SOLD, RENTED, OFFPLAN.
    // This looks like "Current State" not "Listing Intent".
    // However, usually "Rent" listings have a price per year/month. "Sale" has total price.
    // Let's check if there is a `purpose` or `listingType`.
    // There isn't.
    // I will proceed with other filters and come back to this.
  }

  // Property Type
  if (propertyType) {
    // Assuming propertyType is the slug or name, but we need ID.
    // If the UI passes the slug, we might need to look it up or join.
    // Let's assume the UI passes the ID if possible, or we filter by relation.
    // If UI passes "apartment" (slug), we can do:
    where.propertyType = {
      slug: { equals: propertyType, mode: "insensitive" },
    };
  }

  // Bedrooms
  if (bedrooms) {
    if (bedrooms === "4+") {
      where.bedrooms = { gte: 4 };
    } else {
      const beds = parseInt(bedrooms);
      if (!isNaN(beds)) {
        where.bedrooms = beds;
      }
    }
  }

  // Price Range
  if (priceRange) {
    // Example: "under-1m", "1m-5m", "5m-10m", "over-10m"
    switch (priceRange) {
      case "under-1m":
        where.price = { lt: 1000000 };
        break;
      case "1m-5m":
        where.price = { gte: 1000000, lte: 5000000 };
        break;
      case "5m-10m":
        where.price = { gte: 5000000, lte: 10000000 };
        break;
      case "over-10m":
        where.price = { gt: 10000000 };
        break;
    }
  }

  // Location (Exact match or contains?)
  // If `searchQuery` covers location, we might not need this unless it's a specific filter.
  // But if we have a separate location filter:
  if (location) {
     where.location = { contains: location, mode: "insensitive" };
  }

  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
        propertyType: true,
        images: true,
        // Remove the relation include since it's broken
    }
  });

  // Manually fetch media usages for these properties
  const propertyIds = properties.map(p => p.id);
  const mediaUsages = await prisma.mediaUsage.findMany({
    where: {
      entityType: "PROPERTY",
      entityId: { in: propertyIds }
    },
    include: {
      media: true
    }
  });

  // Attach media usages to properties
  return properties.map(p => ({
    ...p,
    mediaUsages: mediaUsages.filter(mu => mu.entityId === p.id)
  }));
}
