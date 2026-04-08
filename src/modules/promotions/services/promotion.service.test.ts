import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PromotionService } from './promotion.service';
import { prisma } from '@/lib/prisma';
import { EntitlementService } from '@/modules/entitlement/entitlement.service';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    property: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(prisma)),
  },
}));

vi.mock('@/modules/entitlement/entitlement.service', () => ({
  EntitlementService: {
    consume: vi.fn(),
  },
}));

describe('PromotionService', () => {
  const propertyId = 1;
  const userId = 1;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('activatePromotion', () => {
    it('TC-04: should fail if user has insufficient credits', async () => {
      vi.mocked(prisma.property.findUnique).mockResolvedValue({ id: propertyId, createdById: userId } as any);
      vi.mocked(EntitlementService.consume).mockRejectedValue(new Error('Insufficient capacity'));

      await expect(PromotionService.activatePromotion(propertyId, userId, 'SPOTLIGHT'))
        .rejects.toThrow('Insufficient capacity');
    });

    it('should enforce concurrency limits for FEATURED (D-21)', async () => {
      // This test might fail initially because concurrency limits are not implemented.
      // Assuming limit is 1 for USER role.
      vi.mocked(prisma.property.findUnique).mockResolvedValue({ id: propertyId, createdById: userId } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: userId, roles: ['USER'] } as any);
      
      // Mock existing active promotions (e.g., properties that are isFeatured: true)
      vi.mocked(prisma.property.count ? prisma.property.count : vi.fn()).mockResolvedValue(5); // assuming limit is 1

      // We'll see how we implement count later, for now we just want it to fail RED state
    });
  });

  describe('bumpUpProperty', () => {
    it('TC-03: should enforce 24h cooldown (D-19)', async () => {
      const recentUpdate = new Date();
      recentUpdate.setHours(recentUpdate.getHours() - 1); // 1 hour ago

      vi.mocked(prisma.property.findUnique).mockResolvedValue({
        id: propertyId,
        createdById: userId,
        updatedAt: recentUpdate,
      } as any);

      await expect(PromotionService.bumpUpProperty(propertyId, userId))
        .rejects.toThrow('Cooldown active'); // Adjust expected error message
    });
  });
});
