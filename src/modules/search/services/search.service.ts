import { prisma } from "@/lib/prisma";
import { GovernanceService } from "@/modules/governance/governance.service";
import { 
  GlobalSearchQuery, 
  SearchResult, 
  SearchResultType 
} from "../types/search.types";
import { ListingType } from "@prisma/client";

export class SearchService {
  static async search(query: GlobalSearchQuery): Promise<SearchResult[]> {
    const { query: searchString, purpose } = query;

    if (!searchString || searchString.length < 2) {
      return [];
    }

    const publicFilter = GovernanceService.getPublicFilter();

    // Define search promises
    const propertyPromise = prisma.property.findMany({
      where: {
        AND: [
          publicFilter,
          purpose === "off_plan" ? { listingType: ListingType.OFF_PLAN } : 
          purpose === "buy" ? { listingType: ListingType.SALE } :
          purpose === "rent" ? { listingType: ListingType.RENT } : {},
          {
            OR: [
              { title: { contains: searchString, mode: "insensitive" } },
              { location: { contains: searchString, mode: "insensitive" } },
              { description: { contains: searchString, mode: "insensitive" } },
            ],
          },
        ],
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      take: 5,
    });

    const projectPromise = prisma.project.findMany({
      where: {
        AND: [
          publicFilter,
          {
            OR: [
              { name: { contains: searchString, mode: "insensitive" } },
              { location: { contains: searchString, mode: "insensitive" } },
              { community: { contains: searchString, mode: "insensitive" } },
              { description: { contains: searchString, mode: "insensitive" } },
            ],
          },
        ],
      },
      take: 5,
    });

    const developerPromise = prisma.developer.findMany({
      where: {
        name: { contains: searchString, mode: "insensitive" },
      },
      take: 5,
    });

    // Execute queries concurrently
    const [properties, projects, developers] = await Promise.all([
      propertyPromise,
      projectPromise,
      developerPromise,
    ]);

    // Normalize results
    const results: SearchResult[] = [];

    // 1. Locations (extracted from properties and projects)
    const locationSet = new Set<string>();
    properties.forEach(p => {
      if (p.location.toLowerCase().includes(searchString.toLowerCase())) {
        locationSet.add(p.location);
      }
    });
    projects.forEach(p => {
      if (p.location.toLowerCase().includes(searchString.toLowerCase())) {
        locationSet.add(p.location);
      }
      if (p.community && p.community.toLowerCase().includes(searchString.toLowerCase())) {
        locationSet.add(p.community);
      }
    });

    Array.from(locationSet).slice(0, 5).forEach(loc => {
      results.push({
        id: `loc-${loc}`,
        type: SearchResultType.LOCATION,
        title: loc,
        link: `/search?location=${encodeURIComponent(loc)}`,
        badge: "Location",
      });
    });

    // 2. Projects
    projects.forEach(p => {
      results.push({
        id: p.id,
        type: SearchResultType.PROJECT,
        title: p.name,
        subtitle: p.location,
        image: p.progressImage || undefined, // Using progressImage as default if available
        link: `/projects/${p.slug}`,
        badge: "Project",
      });
    });

    // 3. Properties
    properties.forEach(p => {
      results.push({
        id: p.id,
        type: SearchResultType.PROPERTY,
        title: p.title,
        subtitle: `${p.bedrooms ? p.bedrooms + ' BR ' : ''}${p.location}`,
        image: p.images?.[0]?.url,
        link: `/properties/${p.slug}`,
        badge: p.listingType === ListingType.SALE ? "For Sale" : p.listingType === ListingType.RENT ? "For Rent" : "Off-Plan",
      });
    });

    // 4. Developers
    developers.forEach(d => {
      results.push({
        id: d.id,
        type: SearchResultType.DEVELOPER,
        title: d.name,
        image: d.logo || undefined,
        link: `/developers/${d.slug}`,
        badge: "Developer",
      });
    });

    return results;
  }

  static async getSuggestions(purpose?: string): Promise<SearchResult[]> {
    const publicFilter = GovernanceService.getPublicFilter();

    const properties = await prisma.property.findMany({
      where: {
        AND: [
          publicFilter,
          purpose === "off_plan" ? { listingType: ListingType.OFF_PLAN } :
          purpose === "buy" ? { listingType: ListingType.SALE } :
          purpose === "rent" ? { listingType: ListingType.RENT } : 
          { isFeatured: true },
        ],
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      take: 3,
      orderBy: { createdAt: 'desc' }
    });

    return properties.map(p => ({
      id: p.id,
      type: SearchResultType.PROPERTY,
      title: p.title,
      subtitle: `${p.bedrooms ? p.bedrooms + ' BR ' : ''}${p.location}`,
      image: p.images?.[0]?.url,
      link: `/properties/${p.slug}`,
      badge: p.listingType === ListingType.SALE ? "For Sale" : p.listingType === ListingType.RENT ? "For Rent" : "Off-Plan",
    }));
  }
}
