import { prisma } from "@/lib/prisma";
import { EntitlementService } from "@/modules/entitlement/entitlement.service";

export type PromotionType = "SPOTLIGHT" | "FEATURED" | "BUMP_UP";

export class PromotionService {
  /**
   * Activates a promotion for a property.
   * This handles the logic of checking entitlements and consuming credits.
   */
  static async activatePromotion(propertyId: number, userId: number, type: "SPOTLIGHT" | "FEATURED") {
    const code = type === "SPOTLIGHT" ? "SPOTLIGHT_CREDIT" : "FEATURED_CREDIT";
    
    return await prisma.$transaction(async (tx) => {
      // 1. Verify property ownership
      const property = await tx.property.findUnique({
        where: { id: propertyId, createdById: userId },
      });

      if (!property) {
        throw new Error("Property not found or access denied.");
      }

      // 2. Consume credit
      await EntitlementService.consume(userId, code, tx);

      // 3. Apply promotion logic
      if (type === "FEATURED") {
        await tx.property.update({
          where: { id: propertyId },
          data: { isFeatured: true },
        });
      }

      // Add promotion record for tracking/expiry if needed in future
      
      return { success: true };
    });
  }

  /**
   * Bumps up a property to the top of the search results.
   */
  static async bumpUpProperty(propertyId: number, userId: number) {
    return await prisma.$transaction(async (tx) => {
      // 1. Verify property ownership
      const property = await tx.property.findUnique({
        where: { id: propertyId, createdById: userId },
      });

      if (!property) {
        throw new Error("Property not found or access denied.");
      }

      // 2. Consume credit
      await EntitlementService.consume(userId, "BUMP_UP_CREDIT", tx);

      // 3. Update updatedAt to bring it to the top
      await tx.property.update({
        where: { id: propertyId },
        data: { updatedAt: new Date() },
      });

      return { success: true };
    });
  }
}