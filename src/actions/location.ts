"use server";

import { prisma } from "@/lib/prisma";
import { GovernanceService } from "@/modules/governance/governance.service";

export async function searchLocations(query: string, listingType?: string) {
    // Map UI purpose to DB ListingType
    let typeFilter: "SALE" | "RENT" | "OFF_PLAN" | undefined;

    if (listingType) {
        const normalized = listingType.toLowerCase();
        if (normalized === "buy" || normalized === "sale") typeFilter = "SALE";
        else if (normalized === "rent") typeFilter = "RENT";
        else if (normalized === "off_plan" || normalized === "off-plan" || normalized === "offplan") typeFilter = "OFF_PLAN";
    }

    const whereClause: any = {
        ...GovernanceService.getPublicFilter(),
    };

    if (typeFilter) {
        whereClause.listingType = typeFilter;
    }

    // If query is empty or short, return some default popular locations
    // We can just return the first 10 distinct locations
    if (!query || query.length < 1) {
        const locations = await prisma.property.findMany({
            where: whereClause,
            select: {
                location: true,
            },
            distinct: ["location"],
            take: 10,
        });
        return locations.map((l) => l.location).filter(Boolean);
    }

    // Find unique locations that match the query
    const locations = await prisma.property.findMany({
        where: {
            ...whereClause,
            location: {
                contains: query,
                mode: "insensitive",
            },
        },
        select: {
            location: true,
        },
        distinct: ["location"],
        take: 10,
    });

    return locations.map((l) => l.location).filter(Boolean);
}
