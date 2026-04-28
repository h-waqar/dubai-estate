import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SearchService } from './search.service';
import { prisma } from '@/lib/prisma';
import { SearchResultType } from '../types/search.types';
import { GovernanceService } from '@/modules/governance/governance.service';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    property: {
      findMany: vi.fn(),
    },
    project: {
      findMany: vi.fn(),
    },
    developer: {
      findMany: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}));

vi.mock('@/modules/governance/governance.service', () => ({
  GovernanceService: {
    getPublicFilter: vi.fn(() => ({
      editorialStatus: 'SUBMITTED',
      moderationStatus: 'APPROVED',
      systemStatus: 'ACTIVE',
    })),
  },
}));

describe('SearchService.search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return normalized results from multiple tables', async () => {
    vi.mocked(prisma.property.findMany).mockResolvedValue([
      { id: 1, title: 'Amazing Villa', location: 'Dubai Marina', slug: 'amazing-villa', images: [], listingType: 'SALE' }
    ] as any);
    vi.mocked(prisma.project.findMany).mockResolvedValue([
      { id: 10, name: 'Palm Jumeirah Project', location: 'Palm', slug: 'palm-project' }
    ] as any);
    vi.mocked(prisma.developer.findMany).mockResolvedValue([
      { id: 100, name: 'Emaar', slug: 'emaar' }
    ] as any);

    const results = await SearchService.search({ query: 'Dubai' });

    expect(results).toContainEqual(expect.objectContaining({
      id: 1,
      type: SearchResultType.PROPERTY,
      title: 'Amazing Villa',
    }));
    expect(results).toContainEqual(expect.objectContaining({
      id: 10,
      type: SearchResultType.PROJECT,
      title: 'Palm Jumeirah Project',
    }));
    expect(results).toContainEqual(expect.objectContaining({
      id: 100,
      type: SearchResultType.DEVELOPER,
      title: 'Emaar',
    }));
  });

  it('should apply public filters from GovernanceService', async () => {
    await SearchService.search({ query: 'test' });

    const publicFilter = GovernanceService.getPublicFilter();
    
    expect(prisma.property.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        AND: expect.arrayContaining([
          expect.objectContaining(publicFilter)
        ])
      })
    }));
    expect(prisma.project.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        AND: expect.arrayContaining([
          expect.objectContaining(publicFilter)
        ])
      })
    }));
  });

  it('should handle "off_plan" purpose correctly', async () => {
    await SearchService.search({ query: 'test', purpose: 'off_plan' });

    // For properties, it should filter by listingType: OFF_PLAN
    expect(prisma.property.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        AND: expect.arrayContaining([
          expect.objectContaining({ listingType: 'OFF_PLAN' })
        ])
      })
    }));

    expect(prisma.project.findMany).toHaveBeenCalled();
  });

  it('should return location suggestions from properties and projects', async () => {
     vi.mocked(prisma.property.findMany).mockResolvedValue([
       { id: 1, title: 'Villa 1', location: 'Dubai Marina', slug: 'v1', images: [], listingType: 'SALE' }
     ] as any);
     vi.mocked(prisma.project.findMany).mockResolvedValue([
       { id: 10, name: 'Project 1', location: 'Palm Jumeirah', community: 'Palm Community', slug: 'p1' }
     ] as any);
     vi.mocked(prisma.developer.findMany).mockResolvedValue([]);

     const results = await SearchService.search({ query: 'Dubai' });

     expect(results).toContainEqual(expect.objectContaining({
       type: SearchResultType.LOCATION,
       title: 'Dubai Marina',
     }));
     
     const results2 = await SearchService.search({ query: 'Palm' });
     expect(results2).toContainEqual(expect.objectContaining({
       type: SearchResultType.LOCATION,
       title: 'Palm Jumeirah',
     }));
     expect(results2).toContainEqual(expect.objectContaining({
       type: SearchResultType.LOCATION,
       title: 'Palm Community',
     }));
  });
});

describe('SearchService.getSuggestions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return rental suggestions when purpose is rent', async () => {
    vi.mocked(prisma.property.findMany).mockResolvedValue([
      { id: 1, title: 'Luxury Apt', location: 'Dubai Marina', slug: 'luxury-apt', images: [{ url: 'img1' }], listingType: 'RENT', bedrooms: 2 }
    ] as any);

    const suggestions = await SearchService.getSuggestions('rent');

    expect(prisma.property.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        AND: expect.arrayContaining([
          expect.objectContaining({ listingType: 'RENT' })
        ])
      }),
      take: 3
    }));

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({
      id: 1,
      type: SearchResultType.PROPERTY,
      title: 'Luxury Apt',
      badge: 'For Rent'
    });
  });

  it('should return sale suggestions when purpose is buy', async () => {
    vi.mocked(prisma.property.findMany).mockResolvedValue([
      { id: 2, title: 'Villa Sale', location: 'Palm', slug: 'villa-sale', images: [], listingType: 'SALE' }
    ] as any);

    await SearchService.getSuggestions('buy');

    expect(prisma.property.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        AND: expect.arrayContaining([
          expect.objectContaining({ listingType: 'SALE' })
        ])
      })
    }));
  });

  it('should return off-plan suggestions when purpose is off_plan', async () => {
    vi.mocked(prisma.property.findMany).mockResolvedValue([]);

    await SearchService.getSuggestions('off_plan');

    expect(prisma.property.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        AND: expect.arrayContaining([
          expect.objectContaining({ listingType: 'OFF_PLAN' })
        ])
      })
    }));
  });

  it('should return top featured properties as default', async () => {
    vi.mocked(prisma.property.findMany).mockResolvedValue([]);

    await SearchService.getSuggestions();

    expect(prisma.property.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        AND: expect.arrayContaining([
          expect.objectContaining({ isFeatured: true })
        ])
      }),
      take: 3
    }));
  });
});
