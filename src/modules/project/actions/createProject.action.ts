"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { ProjectService } from "../services/project.service";
import { createProjectValidator } from "../validators/project.validator";

export async function createProjectAction(formData: FormData) {
    try {
        // Get current user session
        const session = await getServerSession(authOptions);
        console.log("Session:", session);

        if (!session?.user?.email) {
            return {
                success: false,
                error: "You must be logged in to create a project",
            };
        }

        // Get user from database
        console.log("Looking up user with email:", session.user.email);
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        console.log("User found:", user ? `Yes (ID: ${user.id})` : "No");

        if (!user) {
            return {
                success: false,
                error: `User not found for email: ${session.user.email}`,
            };
        }

        // Parse form data
        const rawData = Object.fromEntries(formData.entries());

        // Parse JSON fields
        const data = {
            ...rawData,
            developerId: rawData.developerId ? Number(rawData.developerId) : undefined,
            proposedDeveloperName: rawData.proposedDeveloperName as string | undefined,
            priceFrom: rawData.priceFrom ? Number(rawData.priceFrom) : undefined,
            latitude: rawData.latitude ? Number(rawData.latitude) : undefined,
            longitude: rawData.longitude ? Number(rawData.longitude) : undefined,
            highlights: rawData.highlights ? JSON.parse(rawData.highlights as string) : [],
            floorplans: rawData.floorplans
                ? JSON.parse(rawData.floorplans as string).map((fp: any) => ({
                    ...fp,
                    imageUrl: fp.image?.url,
                }))
                : [],
            paymentPlan: rawData.paymentPlan ? JSON.parse(rawData.paymentPlan as string) : [],
            nearbyAttractions: rawData.nearbyAttractions
                ? JSON.parse(rawData.nearbyAttractions as string)
                : [],
            faqs: rawData.faqs ? JSON.parse(rawData.faqs as string) : [],
            amenityIds: rawData.amenityIds ? JSON.parse(rawData.amenityIds as string) : [],

            // Progress
            progressPercentage: rawData.progressPercentage ? Number(rawData.progressPercentage) : undefined,
            progressStatus: rawData.progressStatus as string | undefined,
            // Extract URL from progressImage object if it exists
            progressImage: rawData.progressImage
                ? (JSON.parse(rawData.progressImage as string)?.url as string)
                : undefined,

            logoId: rawData.logoId ? Number(rawData.logoId) : undefined,
            coverImageId: rawData.coverImageId ? Number(rawData.coverImageId) : undefined,
            galleryIds: rawData.galleryIds ? JSON.parse(rawData.galleryIds as string) : [],
            handoverDate: rawData.handoverDate ? new Date(rawData.handoverDate as string) : undefined,
            announcementDate: rawData.announcementDate
                ? new Date(rawData.announcementDate as string)
                : undefined,
            bookingOpenedDate: rawData.bookingOpenedDate
                ? new Date(rawData.bookingOpenedDate as string)
                : undefined,
            constructionStartDate: rawData.constructionStartDate
                ? new Date(rawData.constructionStartDate as string)
                : undefined,
            tagline: rawData.tagline as string | undefined,
            aboutContent: rawData.aboutContent as string | undefined,
            locationDescription: rawData.locationDescription as string | undefined,
            aboutFeatures: rawData.aboutFeatures
                ? JSON.parse(rawData.aboutFeatures as string).map((f: any) => ({
                    ...f,
                    imageUrl: f.customIcon?.url,
                    category: "ABOUT_FEATURE"
                }))
                : [],
            // Map selected amenities to ProjectFeature format with category AMENITY
            amenityFeatures: rawData.selectedAmenities
                ? JSON.parse(rawData.selectedAmenities as string).map((a: any) => ({
                    name: a.name,
                    icon: a.icon, // If provided in original amenity object, but we might not have it here unless queried. 
                    // Wait, AmenityInput only has id, name, image.
                    // We can't easily get the ICON unless we passed it.
                    // But for now let's focus on name and imageUrl.
                    imageUrl: a.image?.url,
                    category: "AMENITY",
                    order: 0
                }))
                : [],
        };

        // Validate data
        const validatedData = createProjectValidator.parse(data);

        // Create project
        const project = await ProjectService.createProject(user.id, validatedData);

        return {
            success: true,
            data: project,
            message: "Project created successfully and sent for review",
        };
    } catch (error: any) {
        console.error("Error creating project:", error);
        return {
            success: false,
            error: error.message || "Failed to create project",
        };
    }
}
