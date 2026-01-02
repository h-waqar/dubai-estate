"use server";

import { prisma } from "@/lib/prisma";

/**
 * Increments the view counter for a specific project.
 * @param projectId The ID of the project to increment views for.
 */
export async function incrementProjectViews(projectId: number) {
    if (!projectId) return { success: false, error: "Project ID is required" };

    try {
        await prisma.project.update({
            where: { id: projectId },
            data: {
                views: {
                    increment: 1,
                },
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to increment project views:", error);
        return { success: false, error: "Database update failed" };
    }
}
