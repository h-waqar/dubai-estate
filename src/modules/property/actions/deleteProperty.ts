"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { EntitlementService } from "@/modules/entitlement/entitlement.service";
import { GovernanceService } from "@/modules/governance/governance.service";

export async function deletePropertyAction(propertyId: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { createdById: true, status: true },
    });

    if (!property) {
      return { success: false, error: "Property not found" };
    }

    const isAdmin = session.user.roles.includes("ADMIN") || session.user.roles.includes("SUPER_ADMIN");

    if (property.createdById !== session.user.id && !isAdmin) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.$transaction(async (tx) => {
      // Soft delete by archiving using governance service
      await GovernanceService.archiveProperty(propertyId, tx);

      // Release entitlement slot
      const user = await tx.user.findUnique({ where: { id: property.createdById } });
      const ownerIsAdmin = user?.roles.includes("ADMIN") || user?.roles.includes("SUPER_ADMIN");

      if (!ownerIsAdmin) {
        await EntitlementService.release(property.createdById, "PROPERTY_SLOT", tx);
      }
    });

    revalidatePath("/properties");
    revalidatePath("/account");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return { success: false, error: String(error) };
  }
}
