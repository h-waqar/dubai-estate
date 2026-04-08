import { vi, describe, it, expect, beforeEach } from 'vitest';
import { EntitlementService } from './entitlement.service';
import { prisma } from '@/lib/prisma';
import { GrantStatus } from '@prisma/client';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    entitlementGrant: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
    entitlementDefinition: {
      findUnique: vi.fn(),
    },
  },
}));

describe('EntitlementService.consume', () => {
  const userId = 1;
  const code = 'TEST_CREDIT';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-01: should pick the grant with the earliest validTo date (FIFO for expiring credits)', async () => {
    const soonExpiring = { id: 1, amount: 10, used: 0, validTo: new Date('2025-01-01') };
    const laterExpiring = { id: 2, amount: 10, used: 0, validTo: new Date('2025-02-01') };

    vi.mocked(prisma.entitlementGrant.findMany).mockResolvedValue([
      laterExpiring,
      soonExpiring,
    ] as any);

    vi.mocked(prisma.entitlementGrant.update).mockResolvedValue({} as any);

    await EntitlementService.consume(userId, code);

    // Verify it picked the soonExpiring one (id: 1)
    expect(prisma.entitlementGrant.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: soonExpiring.id },
    }));
  });

  it('should pick grants with validTo: null after all expiring grants', async () => {
    const infiniteGrant = { id: 1, amount: 10, used: 0, validTo: null };
    const expiringGrant = { id: 2, amount: 10, used: 0, validTo: new Date('2025-01-01') };

    vi.mocked(prisma.entitlementGrant.findMany).mockResolvedValue([
      infiniteGrant,
      expiringGrant,
    ] as any);

    vi.mocked(prisma.entitlementGrant.update).mockResolvedValue({} as any);

    await EntitlementService.consume(userId, code);

    // Verify it picked expiringGrant (id: 2) first even if infiniteGrant came first from DB
    expect(prisma.entitlementGrant.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: expiringGrant.id },
    }));
  });
});
