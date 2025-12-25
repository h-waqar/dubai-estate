"use server";

import { prisma } from "@/lib/prisma";

export async function searchLocations(query: string) {
    // If query is empty or short, return some default popular locations
    // We can just return the first 10 distinct locations
    if (!query || query.length < 1) {
        const locations = await prisma.property.findMany({
            where: {
                status: "APPROVED",
                published: true,
            },
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
            location: {
                contains: query,
                mode: "insensitive",
            },
            // Ensure we only show locations from published/valid properties
            status: "APPROVED",
            published: true,
        },
        select: {
            location: true,
        },
        distinct: ["location"],
        take: 10,
    });

    return locations.map((l) => l.location).filter(Boolean);
}
