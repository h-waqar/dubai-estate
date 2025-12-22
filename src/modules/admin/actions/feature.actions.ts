"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function togglePropertyFeature(id: number, isFeatured: boolean) {
    try {
        await prisma.property.update({
            where: { id },
            data: { isFeatured },
        });
        revalidatePath("/admin/properties");
        revalidatePath("/properties");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle property feature:", error);
        return { success: false, error: "Failed to update property" };
    }
}

export async function toggleProjectFeature(id: number, isFeatured: boolean) {
    try {
        await prisma.project.update({
            where: { id },
            data: { isFeatured },
        });
        revalidatePath("/admin/projects");
        revalidatePath("/projects");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle project feature:", error);
        return { success: false, error: "Failed to update project" };
    }
}
