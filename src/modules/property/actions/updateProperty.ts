// src/modules/property/actions/updateProperty.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { createPropertyServerValidator } from "../validators/createProperty.validator"; // Reuse or create update validator
import { PropertyStatus } from "@/generated/prisma";
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

    const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGER";

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
    };

    const validation = createPropertyServerValidator.safeParse(data);

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.flatten().fieldErrors,
        };
    }

    const { title, price, propertyTypeId, bedrooms, bathrooms, location, latitude, longitude, furnishing, listingType, description, coverImage, gallery, features } = validation.data;

    // 3. Update Property
    try {
        const updatedStatus = isAdmin ? existingProperty.status : PropertyStatus.PENDING_REVIEW;

        // Manage Transactions for atomicity
        const property = await prisma.$transaction(async (tx) => {
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
                    status: updatedStatus as any,
                    // If user edits, we might want to unpublish until approved
                    published: isAdmin ? undefined : false, // Reset published for non-admins
                    declinedReason: null, // Clear previous decline reasons
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

        revalidatePath("/agent/dashboard");
        revalidatePath(`/properties/${property.slug}`);

        return { success: true, property: serializeDecimals(property) };

    } catch (error) {
        console.error("Failed to update property:", error);
        return { success: false, error: String(error) };
    }
}
