"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { PropertyStatus } from "@prisma/client";
import { EntitlementService } from "@/modules/entitlement/entitlement.service";
import { GovernanceService } from "@/modules/governance/governance.service";

export async function approvePropertyAction(
    propertyId: number,
    status: PropertyStatus,
    declinedReason?: string
) {
    const session = await getServerSession(authOptions);

    if (
        !session?.user ||
        (!session.user.roles.includes("ADMIN") && !session.user.roles.includes("MANAGER"))
    ) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { createdById: true, status: true }
        });

        if (!property) return { success: false, error: "Property not found" };

        await prisma.$transaction(async (tx) => {
            if (status === "APPROVED") {
                await GovernanceService.approveProperty(propertyId, session.user.id, tx);
            } else if (status === "DECLINED") {
                await GovernanceService.rejectProperty(propertyId, session.user.id, declinedReason, tx);
                
                // If it was moved TO Declined, release slot.
                const user = await tx.user.findUnique({ where: { id: property.createdById } });
                const ownerIsAdmin = user?.roles.includes("ADMIN") || user?.roles.includes("SUPER_ADMIN");
                if (!ownerIsAdmin) {
                    await EntitlementService.release(property.createdById, "PROPERTY_SLOT", tx);
                }
            }
        });

        revalidatePath("/admin/approvals");
        revalidatePath("/properties");
        revalidatePath("/account");
        return { success: true };
    } catch (error) {
        console.error("Failed to approve property:", error);
        return { success: false, error: String(error) };
    }
}
