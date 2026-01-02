"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

/**
 * Increments the view counter for a specific property.
 * Includes a check to prevent duplicate views from the same client within 24 hours.
 * @param propertyId The ID of the property to increment views for.
 */
export async function incrementPropertyViews(propertyId: number) {
    if (!propertyId) return { success: false, error: "Property ID is required" };

    const cookieStore = await cookies();
    const viewCookieName = `viewed_property_${propertyId}`;
    const hasViewed = cookieStore.get(viewCookieName);

    if (hasViewed) {
        // console.log(`[ViewCounter] Skipped increment for Property ${propertyId} (Already viewed)`);
        return { success: true, skipped: true };
    }

    try {
        await prisma.property.update({
            where: { id: propertyId },
            data: {
                views: {
                    increment: 1,
                },
            },
        });

        // Set a cookie to expire in 24 hours
        cookieStore.set(viewCookieName, "true", {
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
            httpOnly: true, // Not accessible via JS
            sameSite: "lax",
        });

        // console.log(`[ViewCounter] Incremented view for Property ${propertyId}`);
        return { success: true };
    } catch (error) {
        console.error(`[ViewCounter] Failed to increment views for Property ${propertyId}:`, error);
        return { success: false, error: "Database update failed" };
    }
}
