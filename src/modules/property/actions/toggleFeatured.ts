"use server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { revalidatePath } from "next/cache";

export async function toggleFeatured(propertyId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const property = await prisma.property.findUnique({
    where: { id: propertyId, createdById: session.user.id }
  });

  if (!property) return { success: false, error: "Property not found" };

  if (property.isFeatured) {
     // Unfeature: Allowed, but credit is NOT refunded.
     await prisma.property.update({
        where: { id: propertyId },
        data: { isFeatured: false }
     });
     revalidatePath("/account");
     return { success: true, status: "unfeatured" };
  } else {
     // Feature: Check quota
     const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { 
            pricingPlan: true,
            entitlementGrants: {
                include: { definition: true },
                where: { status: 'ACTIVE' }
            }
        }
     });
     
     const subscription = await prisma.subscription.findFirst({
        where: { userId: session.user.id, status: 'ACTIVE' }
     });

     if (!subscription || !user?.pricingPlan) {
        // Admins bypass?
        if (user?.roles.includes("ADMIN") || user?.roles.includes("SUPER_ADMIN")) {
             await prisma.property.update({
                where: { id: propertyId },
                data: { isFeatured: true }
            });
            revalidatePath("/account");
            return { success: true, status: "featured" };
        }
        return { success: false, error: "No active subscription" };
     }

     const featuredSlotGrant = user.entitlementGrants.find(g => g.definition.code === 'FEATURED_PROPERTY');
     const featuredLimit = featuredSlotGrant ? featuredSlotGrant.amount : 0;

     if (subscription.featuredCreditsUsed >= featuredLimit) {
        return { success: false, error: "Featured quota exceeded" };
     }

     await prisma.$transaction([
        prisma.property.update({
            where: { id: propertyId },
            data: { isFeatured: true }
        }),
        prisma.subscription.update({
            where: { id: subscription.id },
            data: { featuredCreditsUsed: { increment: 1 } }
        })
     ]);

     revalidatePath("/account");
     return { success: true, status: "featured" };
  }
}
