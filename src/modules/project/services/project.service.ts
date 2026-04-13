import { prisma } from "@/lib/prisma";
import { GovernanceService } from "@/modules/governance/governance.service";
import slugify from "slugify";
import { serializeDecimals } from "@/lib/serializeDecimal";
import {
    CreateProjectInput,
    UpdateProjectInput,
    ProjectFilterInput,
} from "../validators/project.validator";

import { EntitlementService } from "@/modules/entitlement/entitlement.service";

export class ProjectService {
    /**
     * Create a new project with all relations
     */
    static async createProject(userId: number, data: CreateProjectInput, isAdmin = false) {
        return await prisma.$transaction(async (tx) => {
        // Generate unique slug
        let slug = slugify(data.name, { lower: true, strict: true });
        let counter = 1;
        let isUnique = false;

        while (!isUnique) {
            const existing = await tx.project.findUnique({
                where: { slug },
            });

            if (!existing) {
                isUnique = true;
            } else {
                counter++;
                slug = `${slugify(data.name, { lower: true, strict: true })}-${counter}`;
            }
        }

        const project = await tx.project.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
                tagline: data.tagline,
                aboutContent: data.aboutContent,
                projectType: data.projectType,
                community: data.community,
                location: data.location,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                locationDescription: data.locationDescription,
                priceFrom: data.priceFrom,
                currency: data.currency,
                paymentPlanSummary: data.paymentPlanSummary,
                handoverDate: data.handoverDate,
                announcementDate: data.announcementDate,
                bookingOpenedDate: data.bookingOpenedDate,
                constructionStartDate: data.constructionStartDate,
                developerId: data.developerId,
                createdById: userId,
                status: "PENDING_REVIEW",
                editorialStatus: "SUBMITTED",
                moderationStatus: "PENDING_REVIEW",

                // Create floorplans
                floorplans: {
                    create: data.floorplans.map((fp) => ({
                        unitType: fp.unitType,
                        unitName: fp.unitName,
                        bedrooms: fp.bedrooms,
                        bathrooms: fp.bathrooms,
                        size: fp.size,
                        sizeUnit: fp.sizeUnit,
                        imageUrl: fp.imageUrl,
                        pdfUrl: fp.pdfUrl,
                        featured: fp.featured,
                    })),
                },

                // Create payment plan
                paymentPlan: {
                    create: data.paymentPlan.map((ps) => ({
                        percentage: ps.percentage,
                        description: ps.description,
                        triggerEvent: ps.triggerEvent,
                        order: ps.order,
                    })),
                },

                // Create nearby attractions
                nearbyAttractions: {
                    create: data.nearbyAttractions.map((na) => ({
                        name: na.name,
                        distance: na.distance,
                        order: na.order,
                    })),
                },

                // Create FAQs
                faqs: {
                    create: data.faqs.map((faq) => ({
                        question: faq.question,
                        answer: faq.answer,
                        order: faq.order,
                    })),
                },

                // Create about features as ProjectFeature
                features: {
                    create: [
                        ...(data.aboutFeatures || []).map((feature: any) => ({
                            name: feature.name,
                            icon: feature.icon,
                            imageUrl: feature.imageUrl,
                            category: "ABOUT_FEATURE",
                            order: feature.order,
                        })),
                        ...(data.amenityFeatures || []).map((feature: any) => ({
                            name: feature.name,
                            icon: feature.icon,
                            imageUrl: feature.imageUrl,
                            category: "AMENITY",
                            order: 0,
                        }))
                    ],
                },

                // Connect amenities
                amenities: {
                    connect: data.amenityIds.map((id) => ({ id })),
                },
            },
            include: {
                developer: true,
                promotions: { where: { status: "ACTIVE", expiresAt: { gt: new Date() } } },
                floorplans: true,
                amenities: true,
                paymentPlan: true,
                nearbyAttractions: true,
                faqs: true,
            },
        });

        // Create MediaUsage entries for logo, cover, gallery
        if (data.logoId) {
            await tx.mediaUsage.create({
                data: {
                    mediaId: data.logoId,
                    entityType: "PROJECT",
                    entityId: project.id,
                    role: "LOGO",
                },
            });
        }

        if (data.coverImageId) {
            await tx.mediaUsage.create({
                data: {
                    mediaId: data.coverImageId,
                    entityType: "PROJECT",
                    entityId: project.id,
                    role: "COVER",
                },
            });
        }

        for (const galleryId of data.galleryIds) {
            await tx.mediaUsage.create({
                data: {
                    mediaId: galleryId,
                    entityType: "PROJECT",
                    entityId: project.id,
                    role: "GALLERY",
                },
            });
        }

        if (!isAdmin) {
            await EntitlementService.consume(userId, "PROJECT_SLOT", tx);
        }

        return serializeDecimals(project);
        });
    }

    /**
     * Get project by ID with all relations
     */
    static async getProjectById(id: number) {
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                developer: true,
                promotions: { where: { status: "ACTIVE", expiresAt: { gt: new Date() } } },
                floorplans: { orderBy: { featured: "desc" } },
                amenities: true,
                features: { orderBy: { order: "asc" } },
                paymentPlan: { orderBy: { order: "asc" } },
                nearbyAttractions: { orderBy: { order: "asc" } },
                progressTimeline: { orderBy: { order: "asc" } },
                faqs: { orderBy: { order: "asc" } },
                createdBy: { select: { id: true, name: true, email: true } },
                approvedBy: { select: { id: true, name: true } },
            },
        });
        return serializeDecimals(project);
    }

    /**
     * Get project by slug with all relations
     */
    static async getProjectBySlug(slug: string) {
        const project = await prisma.project.findUnique({
            where: { slug },
            include: {
                developer: true,
                promotions: { where: { status: "ACTIVE", expiresAt: { gt: new Date() } } },
                floorplans: { orderBy: { featured: "desc" } },
                amenities: true,
                features: { orderBy: { order: "asc" } },
                paymentPlan: { orderBy: { order: "asc" } },
                nearbyAttractions: { orderBy: { order: "asc" } },
                progressTimeline: { orderBy: { order: "asc" } },
                faqs: { orderBy: { order: "asc" } },
                createdBy: { select: { id: true, name: true, email: true } },
            },
        });
        return serializeDecimals(project);
    }

    /**
     * List projects with filters
     */
    static async listProjects(filters: ProjectFilterInput = {}) {
        const where: any = {};

        if (filters.projectType) {
            where.projectType = filters.projectType;
        }

        if (filters.developerId) {
            where.developerId = filters.developerId;
        }

        // Governance Filter Logic
        if (filters.editorialStatus) where.editorialStatus = filters.editorialStatus;
        if (filters.moderationStatus) where.moderationStatus = filters.moderationStatus;
        if (filters.systemStatus) where.systemStatus = filters.systemStatus;
        if (filters.published !== undefined) where.published = filters.published;

        // Backward compatibility with status
        if (filters.status) {
            where.status = filters.status;
        } else if (
            !filters.editorialStatus &&
            !filters.moderationStatus &&
            !filters.systemStatus &&
            filters.published === undefined &&
            !filters.createdById // Don't apply public filter for user's own projects
        ) {
            Object.assign(where, GovernanceService.getPublicFilter());
        }

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } },
                { location: { contains: filters.search, mode: "insensitive" } },
            ];
        }

        if (filters.createdById) {
            where.createdById = filters.createdById;
        }

        const projects = await prisma.project.findMany({
            where,
            include: {
                developer: true,
                promotions: { where: { status: "ACTIVE", expiresAt: { gt: new Date() } } },
                _count: {
                    select: {
                        floorplans: true,
                        amenities: true,
                    },
                },
                createdBy: { select: { id: true, name: true, email: true } },
                approvedBy: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        // Fetch media for all projects
        const projectIds = projects.map(p => p.id);
        const mediaUsages = await prisma.mediaUsage.findMany({
            where: {
                entityType: "PROJECT",
                entityId: { in: projectIds },
            },
            include: {
                media: true,
            },
        });

        // Attach media to projects
        return projects.map(project => ({
            ...project, isFeatured: (project.promotions || []).length > 0,
            mediaUsages: mediaUsages.filter(mu => mu.entityId === project.id),
        }));
    }

    /**
     * Get pending projects for admin approval
     */
    static async getPendingProjects() {
        return prisma.project.findMany({
            where: { status: "PENDING_REVIEW" },
            include: {
                developer: true,
                promotions: { where: { status: "ACTIVE", expiresAt: { gt: new Date() } } },
                createdBy: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    /**
     * Approve project
     */
    static async approveProject(projectId: number, adminId: number) {
        return GovernanceService.approveProject(projectId, adminId);
    }

    /**
     * Decline project
     */
    static async declineProject(projectId: number, adminId: number, reason?: string) {
        return GovernanceService.rejectProject(projectId, adminId);
    }

    /**
     * Update project
     */
    static async updateProject(projectId: number, data: Partial<UpdateProjectInput>) {
        const updateData: any = { ...data };

        // Update slug if name changed
        if (data.name) {
            updateData.slug = slugify(data.name, { lower: true, strict: true });
        }

        // Remove nested relations from update data
        delete updateData.floorplans;
        delete updateData.paymentPlan;
        delete updateData.nearbyAttractions;
        delete updateData.faqs;
        delete updateData.amenityIds;

        // Reset status to PENDING_REVIEW on edit
        updateData.status = "PENDING_REVIEW";
        updateData.editorialStatus = "SUBMITTED";
        updateData.moderationStatus = "PENDING_REVIEW";
        updateData.published = false;
        updateData.approvedById = null;
        updateData.publishedAt = null;

        return prisma.project.update({
            where: { id: projectId },
            data: updateData,
        });
    }

    /**
     * Delete project
     */
    static async deleteProject(projectId: number) {
        return prisma.project.delete({
            where: { id: projectId },
        });
    }
}
