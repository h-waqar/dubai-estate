"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { PropertyStatus } from "@/generated/prisma";

export async function approvePropertyAction(
    propertyId: number,
    status: PropertyStatus,
    declinedReason?: string
) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user ||
        (session.user.role !== "ADMIN" && session.user.role !== "MANAGER")
    ) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const updateData: any = { status };

        if (status === "APPROVED") {
            updateData.approvedById = session.user.id;
            // Also publish it so it's visible
            updateData.published = true;
            updateData.publishedAt = new Date();
        } else if (status === "DECLINED") {
            updateData.approvedById = session.user.id; // Track who declined it
            updateData.declinedReason = declinedReason;
            updateData.published = false;
        }

        await prisma.property.update({
            where: { id: propertyId },
            data: updateData,
        });

        revalidatePath("/admin/approvals");
        revalidatePath("/properties");
        return { success: true };
    } catch (error) {
        console.error("Failed to approve property:", error);
        return { success: false, error: String(error) };
    }
}
