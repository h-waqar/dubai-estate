import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { DeveloperStatus } from "@prisma/client";
import { GovernanceService } from "@/modules/governance/governance.service";

export class DeveloperService {
    /**
     * Create a new developer
     */
    static async createDeveloper(data: {
        name: string;
        description?: string;
        logo?: string;
        website?: string;
        email?: string;
        phone?: string;
    }) {
        const slug = slugify(data.name, { lower: true, strict: true });

        return prisma.developer.create({
            data: {
                ...data,
                slug,
            },
        });
    }

    /**
     * Get all developers
     */
    static async listDevelopers(status?: DeveloperStatus) {
        return prisma.developer.findMany({
            where: status ? { status } : undefined,
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { projects: true },
                },
            },
        });
    }

    /**
     * Get developer by ID
     */
    static async getDeveloperById(id: number) {
        return prisma.developer.findUnique({
            where: { id },
            include: {
                projects: {
                    where: GovernanceService.getPublicFilter(),
                    orderBy: { createdAt: "desc" },
                },
            },
        });
    }

    /**
     * Get developer by slug
     */
    static async getDeveloperBySlug(slug: string) {
        return prisma.developer.findUnique({
            where: { slug },
            include: {
                projects: {
                    where: GovernanceService.getPublicFilter(),
                    orderBy: { createdAt: "desc" },
                },
            },
        });
    }

    /**
     * Update developer
     */
    static async updateDeveloper(
        id: number,
        data: Partial<{
            name: string;
            description: string;
            logo: string;
            website: string;
            email: string;
            phone: string;
        }>
    ) {
        const updateData: any = { ...data };

        // Update slug if name changed
        if (data.name) {
            updateData.slug = slugify(data.name, { lower: true, strict: true });
        }

        return prisma.developer.update({
            where: { id },
            data: updateData,
        });
    }

    /**
     * Delete developer
     */
    static async deleteDeveloper(id: number) {
        return prisma.developer.delete({
            where: { id },
        });
    }
}
