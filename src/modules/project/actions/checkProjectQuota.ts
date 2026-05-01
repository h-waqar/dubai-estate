"use server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { EntitlementService } from "@/modules/entitlement/entitlement.service";

export async function checkProjectQuota() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { allowed: false, error: "Unauthorized" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return { allowed: false, error: "User not found" };

  // Admins bypass quota
  if (user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN")) {
    return { allowed: true, isAdmin: true };
  }

  const { totalCapacity, totalUsed } = await EntitlementService.getQuotaStatus(user.id, "PROJECT_SLOT", "PROJECT");

  if (totalCapacity === 0) {
      return { allowed: false, error: "No active entitlements found. Buy a plan to start listing." };
  }

  if (totalUsed >= totalCapacity) {
    return { 
        allowed: false, 
        error: "Quota Exceeded", 
        current: totalUsed, 
        max: totalCapacity 
    };
  }

  return { 
    allowed: true, 
    current: totalUsed, 
    max: totalCapacity 
  };
}
