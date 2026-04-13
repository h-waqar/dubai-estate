// src\modules\property\services\listProperties.ts
"use server";
import { prisma } from "@/lib/prisma";
import { GovernanceService } from "@/modules/governance/governance.service";
import { serializeDecimals } from "@/lib/serializeDecimal";

export type PropertyFilters = {
  searchQuery?: string;
  propertyStatus?: string; // This actually maps to listingType (Sale/Rent)
  approvalStatus?: string; // This maps to DB status (APPROVED, PENDING_REVIEW)
  editorialStatus?: string;
  moderationStatus?: string;
  systemStatus?: string;
  published?: boolean;
  propertyType?: string;
  bedrooms?: string;
  priceRange?: string;
  location?: string;
  sort?: string;
  userId?: number;
  page?: number;
  limit?: number;
};

export async function listProperties(filters: PropertyFilters = {}) {
  const {
    searchQuery,
    propertyStatus,
    approvalStatus,
    editorialStatus,
    moderationStatus,
    systemStatus,
    published,
    propertyType,
    bedrooms,
    priceRange,
    location,
    sort,
    userId, // Add userId to destructuring
    page = 1,
    limit = 3,
  } = filters;

  const where: any = {};

  // Filter by User ID (for Agent Dashboard)
  if (userId) {
    where.createdById = userId;
  }

  // Governance Filter Logic
  if (editorialStatus) where.editorialStatus = editorialStatus;
  if (moderationStatus) where.moderationStatus = moderationStatus;
  if (systemStatus) where.systemStatus = systemStatus;
  if (published !== undefined) where.published = published;

  // Backward compatibility with approvalStatus
  if (approvalStatus) {
    if (approvalStatus !== "ALL") {
      where.status = approvalStatus;
    }
  } else if (!editorialStatus && !moderationStatus && !systemStatus && published === undefined) {
    // Only default to public filter if NOT filtering by userId and no specific governance filter provided
    if (!userId) {
      Object.assign(where, GovernanceService.getPublicFilter());
    }
  }

  // Search Query (Title or Location)
  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { location: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  // Property Status (Buy/Rent/OffPlan) -> Maps to ListingType
  if (propertyStatus) {
    // propertyStatus from UI: "sale", "rent", "off_plan" (or "off-plan"?)
    // Let's assume UI sends "sale", "rent", "off_plan" matching the enum (case insensitive)

    let typeStr = propertyStatus.toUpperCase();
    if (typeStr === "OFF-PLAN") typeStr = "OFF_PLAN"; // Handle potential slug variation
    if (typeStr === "BUY") typeStr = "SALE"; // Map "BUY" from frontend to "SALE" in DB

    if (["SALE", "RENT", "OFF_PLAN"].includes(typeStr)) {
      where.listingType = typeStr;
    }
  }

  // Property Type
  if (propertyType && propertyType !== "all") {
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

  // Sorting
  let orderBy: any = { createdAt: "desc" }; // Default: Newest (Relevance fallback)

  if (sort) {
    switch (sort) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "featured":
        orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];
        break;
      case "relevance":
      default:
        orderBy = { createdAt: "desc" }; // Fallback to newest for now
        break;
    }
  }

  const skip = (page - 1) * limit;

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        promotions: { where: { status: "ACTIVE", expiresAt: { gt: new Date() } } },
        propertyType: true,
        images: true,
        createdBy: true,
        approvedBy: true,
      },
    }),
    prisma.property.count({ where }),
  ]);

  // Manually fetch media usages for these properties
  const propertyIds = properties.map((p) => p.id);
  const mediaUsages = await prisma.mediaUsage.findMany({
    where: {
      entityType: "PROPERTY",
      entityId: { in: propertyIds },
    },
    include: {
      media: true,
    },
  });

  // Attach media usages to properties
  const result = properties.map((p) => ({
    ...p,
    isFeatured: (p.promotions || []).length > 0, mediaUsages: mediaUsages.filter((mu) => mu.entityId === p.id),
  }));

  return {
    data: serializeDecimals(result),
    total,
  };
}
