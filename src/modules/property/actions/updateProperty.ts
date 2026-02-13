// src/modules/property/actions/updateProperty.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { createPropertyServerValidator } from "../validators/createProperty.validator"; // Reuse or create update validator
import { PropertyStatus } from "@prisma/client";
import { serializeDecimals } from "@/lib/serializeDecimal";

export async function updatePropertyAction(
    propertyId: number,
    formData: FormData
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id as number;

    // 1. Verify ownership (or admin role)
    const existingProperty = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { createdById: true, status: true },
    });

    if (!existingProperty) {
        return { success: false, error: "Property not found" };
    }

    const isAdmin = session.user.roles.includes("ADMIN") || session.user.roles.includes("MANAGER");

    if (existingProperty.createdById !== userId && !isAdmin) {
        return { success: false, error: "Unauthorized to edit this property" };
    }

    // 2. Parse Data
    // Note: We're reusing the create validator for now as fields are similar. 
    // Ideally, we might want a partial update, but the form sends everything.
    const data = {
        title: formData.get("title"),
        price: formData.get("price"),
        propertyTypeId: formData.get("propertyTypeId"),
        bedrooms: formData.get("bedrooms"),
        bathrooms: formData.get("bathrooms"),
        location: formData.get("location"),
        latitude: formData.get("latitude"),
        longitude: formData.get("longitude"),
        furnishing: formData.get("furnishing"),
        listingType: formData.get("listingType"),
        description: formData.get("description") || "",
        // Handling media slightly differently for updates? 
        // The wizard sends coverImage and gallery as IDs if they are already uploaded/selected
        // createPropertyServerValidator expects strings/numbers that can be coerced.
        coverImage: formData.get("coverImage"),
        gallery: formData.getAll("gallery[]"),
        features: formData.getAll("features[]"),
        developerId: formData.get("developerId") ? Number(formData.get("developerId")) : undefined,
        proposedDeveloperName: formData.get("proposedDeveloperName")?.toString() || undefined,
    };

    const validation = createPropertyServerValidator.safeParse(data);

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.flatten().fieldErrors,
        };
    }

    const { title, price, propertyTypeId, bedrooms, bathrooms, location, latitude, longitude, furnishing, listingType, description, coverImage, gallery, features, developerId, proposedDeveloperName } = validation.data;

    // 3. Update Property
    try {
        const updatedStatus = isAdmin ? existingProperty.status : PropertyStatus.PENDING_REVIEW;

        // Handle Developer Logic (same as create)
        let finalDeveloperId = developerId;
        let finalProposedName = proposedDeveloperName;

        if (finalProposedName && !finalDeveloperId) {
            const existingDev = await prisma.developer.findUnique({
                where: { name: finalProposedName },
            });
            if (existingDev) {
                if (existingDev.status === "APPROVED") {
                    finalDeveloperId = existingDev.id;
                    finalProposedName = undefined;
                }
            } else {
                await prisma.developer.create({
                    data: {
                        name: finalProposedName,
                        slug: finalProposedName.toLowerCase().replace(/\s+/g, '-'), // Simple slug check
                        status: "PENDING",
                        createdById: userId,
                    }
                });
            }
        }

        // Manage Transactions for atomicity
        const property = await prisma.$transaction(async (tx) => {
            const editorialStatus = "SUBMITTED";
            const moderationStatus = isAdmin ? "APPROVED" : "PENDING_REVIEW";
            const publishedStatus = isAdmin ? true : false;
            const legacyStatus = isAdmin ? "APPROVED" : "PENDING_REVIEW";

            // Update Core Fields
            const p = await tx.property.update({
                where: { id: propertyId },
                data: {
                    title,
                    price: price, // Decimal handled by Prisma
                    propertyTypeId,
                    bedrooms,
                    bathrooms,
                    location,
                    latitude,
                    longitude,
                    furnishing: furnishing as any,
                    listingType: listingType as any,
                    description,
                    status: legacyStatus as any,
                    editorialStatus: editorialStatus as any,
                    moderationStatus: moderationStatus as any,
                    systemStatus: "ACTIVE", // Ensure it's active or keep current
                    published: publishedStatus,
                    declinedReason: null, // Clear previous decline reasons
                    developerId: finalDeveloperId ?? null,
                    ...(finalDeveloperId !== undefined && { developerId: finalDeveloperId }),
                    ...(finalProposedName !== undefined && { proposedDeveloperName: finalProposedName }),
                }
            });

            // Update Features
            // Delete existing features and add new ones (simpler than syncing)
            if (features) {
                await tx.propertyFeature.deleteMany({
                    where: { propertyId: propertyId }
                });
                await tx.propertyFeature.createMany({
                    data: features.map(fid => ({
                        propertyId: propertyId,
                        featureId: fid
                    }))
                });
            }

            // Update Media Usage
            // 1. Cover Image
            if (coverImage) {
                // Check if this cover image is already set? 
                // Depending on how MediaUsage is modeled, we might want to ensure only one COVER role exists.
                await tx.mediaUsage.deleteMany({
                    where: {
                        entityId: propertyId,
                        entityType: "PROPERTY",
                        role: "COVER"
                    }
                });
                await tx.mediaUsage.create({
                    data: {
                        mediaId: coverImage,
                        entityId: propertyId,
                        entityType: "PROPERTY",
                        role: "COVER"
                    }
                });
            }

            // 2. Gallery
            // The wizard might send a mix of old (already linked) and new images.
            // Simplest approach: Unlink all GALLERY images for this property and re-link the ones sent.
            if (gallery && gallery.length > 0) {
                await tx.mediaUsage.deleteMany({
                    where: {
                        entityId: propertyId,
                        entityType: "PROPERTY",
                        role: "GALLERY"
                    }
                });
                await tx.mediaUsage.createMany({
                    data: gallery.map(mediaId => ({
                        mediaId: mediaId,
                        entityId: propertyId,
                        entityType: "PROPERTY",
                        role: "GALLERY"
                    }))
                });
            }

            return p;
        });

        revalidatePath("/account/dashboard");
        revalidatePath(`/properties/${property.slug}`);

        return { success: true, property: serializeDecimals(property) };

    } catch (error) {
        console.error("Failed to update property:", error);
        return { success: false, error: String(error) };
    }
}
