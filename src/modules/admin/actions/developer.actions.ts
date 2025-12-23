"use server";

import { prisma } from "@/lib/prisma";
import { DeveloperStatus } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

export async function getDevelopers(status?: DeveloperStatus) {
    return await prisma.developer.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
    });
}

export async function approveDeveloper(developerId: number) {
    try {
        // 1. Update status
        const developer = await prisma.developer.update({
            where: { id: developerId },
            data: { status: DeveloperStatus.APPROVED },
        });

        // 2. Link properties
        // Find properties with proposedDeveloperName matching developer.name (case insensitive if possible, but exact match safer for now or relying on normalization)
        // Prisma postgres supports mode: 'insensitive'
        await prisma.property.updateMany({
            where: {
                proposedDeveloperName: { equals: developer.name, mode: "insensitive" },
                developerId: null,
            },
            data: {
                developerId: developer.id,
                proposedDeveloperName: null,
            },
        });

        revalidatePath("/admin/developers");
        return { success: true };
    } catch (error) {
        console.error("Failed to approve developer:", error);
        return { success: false, error: String(error) };
    }
}

export async function declineDeveloper(developerId: number) {
    try {
        await prisma.developer.update({
            where: { id: developerId },
            data: { status: DeveloperStatus.DECLINED },
        });
        revalidatePath("/admin/developers");
        return { success: true };
    } catch (error) {
        console.error("Failed to decline developer:", error);
        return { success: false, error: String(error) };
    }
}
