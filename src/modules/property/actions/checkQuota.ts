"use server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { Role } from "@/generated/prisma/index.js";

export async function checkQuota() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { allowed: false, error: "Unauthorized" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { pricingPlan: true }
  });

  if (!user) return { allowed: false, error: "User not found" };

  // Admins bypass quota
  if (user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN")) {
    return { allowed: true, isAdmin: true };
  }

  if (!user.pricingPlan) {
    return { allowed: false, error: "No Active Plan" };
  }

  if (user.subscriptionStatus !== "ACTIVE") {
     return { allowed: false, error: "Subscription Inactive" };
  }

  const count = await prisma.property.count({
    where: { 
        createdById: user.id,
        status: { notIn: ["ARCHIVED", "DECLINED"] } 
    }
  });

  if (count >= user.pricingPlan.maxListings) {
    return { 
        allowed: false, 
        error: "Quota Exceeded", 
        current: count, 
        max: user.pricingPlan.maxListings 
    };
  }

  return { 
    allowed: true, 
    current: count, 
    max: user.pricingPlan.maxListings 
  };
}
