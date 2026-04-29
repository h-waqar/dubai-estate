import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PromotionService } from './promotion.service';
import { prisma } from '@/lib/prisma';
import { PromotionType, PromotionStatus, GrantStatus } from '@prisma/client';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    promotion: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    entitlementGrant: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}));

vi.mock('@/modules/finance/ledger.service', () => ({
    ledgerService: {
        recordTransaction: vi.fn(),
    }
}));

describe('PromotionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('activatePromotion', () => {
    it('should throw error if entity already has active promotion of same type', async () => {
      vi.mocked(prisma.promotion.findFirst).mockResolvedValue({ id: '1' } as any);

      await expect(PromotionService.activatePromotion(1, 'SPOTLIGHT', 'PROPERTY', 1))
        .rejects.toThrow('Entity already has an active SPOTLIGHT promotion');
    });

    it('should throw error if user has no available credits', async () => {
      vi.mocked(prisma.promotion.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.entitlementGrant.findFirst).mockResolvedValue(null);

      await expect(PromotionService.activatePromotion(1, 'SPOTLIGHT', 'PROPERTY', 1))
        .rejects.toThrow('No available SPOTLIGHT_CREDIT credits');
    });

    it('should activate promotion and deduct credit', async () => {
      vi.mocked(prisma.promotion.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.entitlementGrant.findFirst).mockResolvedValue({
        id: 'grant-1',
        amount: 1,
        used: 0,
        status: GrantStatus.ACTIVE,
      } as any);

      await PromotionService.activatePromotion(1, 'SPOTLIGHT', 'PROPERTY', 1);

      expect(prisma.promotion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'SPOTLIGHT',
          propertyId: 1,
          status: 'ACTIVE',
        }),
      });

      expect(prisma.entitlementGrant.update).toHaveBeenCalledWith({
        where: { id: 'grant-1' },
        data: { 
            used: { increment: 1 },
            status: GrantStatus.ACTIVE // Should stay active if used < amount
        },
      });
    });
  });

  describe('bumpUpProperty', () => {
    it('should throw error if recently bumped', async () => {
      vi.mocked(prisma.promotion.findFirst).mockResolvedValue({
        createdAt: new Date(),
      } as any);

      await expect(PromotionService.bumpUpProperty(1, 1))
        .rejects.toThrow('Recently bumped up');
    });

    it('should bump up property and deduct credit', async () => {
      vi.mocked(prisma.promotion.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.entitlementGrant.findFirst).mockResolvedValue({
        id: 'grant-1',
        amount: 1,
        used: 0,
      } as any);

      await PromotionService.bumpUpProperty(1, 1);

      expect(prisma.promotion.create).toHaveBeenCalled();
      expect(prisma.entitlementGrant.update).toHaveBeenCalled();
    });
  });

  describe('getCooldownStatus', () => {
      it('should return isCooldown true if recently bumped', async () => {
          const now = new Date();
          vi.mocked(prisma.promotion.findFirst).mockResolvedValue({
              createdAt: now
          } as any);

          const status = await PromotionService.getCooldownStatus(1, 1);
          expect(status.isCooldown).toBe(true);
          expect(status.remainingMinutes).toBeGreaterThan(0);
      });

      it('should return isCooldown false if not recently bumped', async () => {
          vi.mocked(prisma.promotion.findFirst).mockResolvedValue(null);

          const status = await PromotionService.getCooldownStatus(1, 1);
          expect(status.isCooldown).toBe(false);
          expect(status.remainingMinutes).toBe(0);
      });
  });
});
