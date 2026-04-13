import { vi, describe, it, expect, beforeEach } from "vitest";
import { PromotionService } from "./promotion.service";
import { prisma } from "@/lib/prisma";
import { EntitlementService } from "@/modules/entitlement/entitlement.service";
import { PromotionStatus, Role } from "@prisma/client";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    property: {
      findUnique: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    project: {
      findUnique: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    promotion: {
      create: vi.fn(),
      findMany: vi.fn(),
      updateMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
    },
    subscription: {
      findFirst: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(prisma)),
  },
}));

vi.mock("@/modules/entitlement/entitlement.service", () => ({
  EntitlementService: {
    consume: vi.fn(),
  },
}));

describe("PromotionService", () => {
  const propertyId = 1;
  const projectId = 100;
  const userId = 1;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("activatePromotion", () => {
    it("should fail if property/project not found or access denied", async () => {
      vi.mocked(prisma.property.findUnique).mockResolvedValue(null);
      await expect(PromotionService.activatePromotion(propertyId, "SPOTLIGHT", "PROPERTY", userId))
        .rejects.toThrow("Entity not found or access denied.");
    });

    it("should enforce concurrency limits based on role (D-21)", async () => {
      vi.mocked(prisma.property.findUnique).mockResolvedValue({ id: propertyId, createdById: userId } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: userId, roles: [Role.USER] } as any);
      
      // Limit for USER is 1. Mock 1 active promotion.
      vi.mocked(prisma.promotion.count).mockResolvedValue(1);

      await expect(PromotionService.activatePromotion(propertyId, "SPOTLIGHT", "PROPERTY", userId))
        .rejects.toThrow("Concurrency limit reached");
    });

    it("should successfully activate promotion and create record", async () => {
      vi.mocked(prisma.property.findUnique).mockResolvedValue({ id: propertyId, createdById: userId } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: userId, roles: [Role.MANAGER] } as any); // Limit is 10
      vi.mocked(prisma.promotion.count).mockResolvedValue(0);
      vi.mocked(EntitlementService.consume).mockResolvedValue(true as any);

      const result = await PromotionService.activatePromotion(propertyId, "SPOTLIGHT", "PROPERTY", userId);

      expect(result.success).toBe(true);
      expect(prisma.promotion.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          propertyId,
          userId,
          type: "SPOTLIGHT",
          status: "ACTIVE",
        }),
      }));
    });

    it("should support PROJECT entities", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({ id: projectId, createdById: userId } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: userId, roles: [Role.MANAGER] } as any);
      vi.mocked(prisma.promotion.count).mockResolvedValue(0);
      vi.mocked(EntitlementService.consume).mockResolvedValue(true as any);
      
      const result = await PromotionService.activatePromotion(projectId, "FEATURED", "PROJECT", userId);

      expect(result.success).toBe(true);
      expect(prisma.promotion.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          projectId,
          userId,
          type: "FEATURED",
        }),
      }));
    });
  });

  describe("terminatePromotionsOnSubscriptionExpiry", () => {
    it("should terminate active promotions if no active subscription (D-18)", async () => {
      vi.mocked(prisma.subscription.findFirst).mockResolvedValue(null); // No active sub

      await PromotionService.terminatePromotionsOnSubscriptionExpiry(userId);

      expect(prisma.promotion.updateMany).toHaveBeenCalledWith({
        where: {
          userId,
          status: PromotionStatus.ACTIVE,
        },
        data: {
          status: PromotionStatus.EXPIRED,
        },
      });
    });

    it("should do nothing if user has active subscription", async () => {
      vi.mocked(prisma.subscription.findFirst).mockResolvedValue({ id: "sub_1", status: "ACTIVE" } as any);

      await PromotionService.terminatePromotionsOnSubscriptionExpiry(userId);

      expect(prisma.promotion.updateMany).not.toHaveBeenCalled();
    });
  });

  describe("bumpUpProperty", () => {
    it("should enforce 24h cooldown using history table (D-19)", async () => {
      const recentPromotion = {
        createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      };
      
      vi.mocked(prisma.property.findUnique).mockResolvedValue({ id: propertyId, createdById: userId } as any);
      vi.mocked(prisma.promotion.findFirst).mockResolvedValue(recentPromotion as any);

      await expect(PromotionService.bumpUpProperty(propertyId, userId, "PROPERTY"))
        .rejects.toThrow("Cooldown active");
    });

    it("should allow bump up if no previous record or cooldown passed", async () => {
      vi.mocked(prisma.property.findUnique).mockResolvedValue({ id: propertyId, createdById: userId } as any);
      vi.mocked(prisma.promotion.findFirst).mockResolvedValue(null);
      vi.mocked(EntitlementService.consume).mockResolvedValue(true as any);

      const result = await PromotionService.bumpUpProperty(propertyId, userId, "PROPERTY");

      expect(result.success).toBe(true);
      expect(prisma.promotion.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          type: "BUMP_UP",
        }),
      }));
    });
  });
});
