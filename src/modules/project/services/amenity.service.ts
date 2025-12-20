import { prisma } from "@/lib/prisma";

export class ProjectAmenityService {
    /**
     * Create a new amenity
     */
    static async createAmenity(data: {
        name: string;
        icon?: string;
        category?: string;
    }) {
        return prisma.projectAmenity.create({
            data,
        });
    }

    /**
     * Get all amenities
     */
    static async listAmenities() {
        return prisma.projectAmenity.findMany({
            orderBy: { name: "asc" },
        });
    }

    /**
     * Get amenity by ID
     */
    static async getAmenityById(id: number) {
        return prisma.projectAmenity.findUnique({
            where: { id },
        });
    }

    /**
     * Update amenity
     */
    static async updateAmenity(
        id: number,
        data: Partial<{
            name: string;
            icon: string;
            category: string;
        }>
    ) {
        return prisma.projectAmenity.update({
            where: { id },
            data,
        });
    }

    /**
     * Delete amenity
     */
    static async deleteAmenity(id: number) {
        return prisma.projectAmenity.delete({
            where: { id },
        });
    }
}
