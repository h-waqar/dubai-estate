import { prisma } from '@/lib/prisma';
import { EntitlementService } from '@/modules/entitlement/entitlement.service';
import { PromotionStatus, PromotionType, Role, SubscriptionStatus } from '@prisma/client';

const CONCURRENCY_LIMITS: Record<string, number> = {
  [Role.USER]: 1,
  [Role.MANAGER]: 10,
  [Role.ADMIN]: Infinity,
  [Role.SUPER_ADMIN]: Infinity,
  [Role.EDITOR]: 5,
  [Role.WRITER]: 2,
  [Role.SUPPORT]: 5,
};

export class PromotionService {
  /**
   * Activates a promotion for a property or project.
   */
  static async activatePromotion(entityId: number, type: PromotionType, entityType: 'PROPERTY' | 'PROJECT', userId: number) {
    const code = type === 'SPOTLIGHT' ? 'SPOTLIGHT_CREDIT' : 'FEATURED_CREDIT';
    
    return await prisma.$transaction(async (tx) => {
      let entity;
      if (entityType === 'PROPERTY') {
        entity = await tx.property.findUnique({
          where: { id: entityId, createdById: userId },
        });
      } else {
        entity = await tx.project.findUnique({
          where: { id: entityId, createdById: userId },
        });
      }

      if (!entity) {
        throw new Error('Entity not found or access denied.');
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { roles: true },
      });

      const roles = user?.roles || [Role.USER];
      const primaryRole = roles[0] || Role.USER;
      const limit = CONCURRENCY_LIMITS[primaryRole] || 1;

      const activeCount = await tx.promotion.count({
        where: {
          userId,
          status: PromotionStatus.ACTIVE,
          type: { in: [PromotionType.SPOTLIGHT, PromotionType.FEATURED] },
        },
      });

      if (activeCount >= limit) {
        throw new Error('Concurrency limit reached');
      }

      await EntitlementService.consume(userId, code, tx);

      const expiresAt = new Date();
      const durationDays = type === PromotionType.SPOTLIGHT ? 7 : 30;
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      await tx.promotion.create({
        data: {
          userId,
          type,
          status: PromotionStatus.ACTIVE,
          expiresAt,
          propertyId: entityType === 'PROPERTY' ? entityId : undefined,
          projectId: entityType === 'PROJECT' ? entityId : undefined,
        },
      });

      if (entityType === 'PROPERTY') {
        await tx.property.update({
          where: { id: entityId },
          data: { isFeatured: type === PromotionType.FEATURED || type === PromotionType.SPOTLIGHT },
        });
      } else {
        await tx.project.update({
          where: { id: entityId },
          data: { isFeatured: type === PromotionType.FEATURED || type === PromotionType.SPOTLIGHT },
        });
      }
      
      return { success: true };
    });
  }

  /**
   * Bumps up a property/project.
   */
  static async bumpUpProperty(entityId: number, userId: number, entityType: 'PROPERTY' | 'PROJECT' = 'PROPERTY') {
    const COOLDOWN_HOURS = 24;

    return await prisma.$transaction(async (tx) => {
      let entity;
      if (entityType === 'PROPERTY') {
        entity = await tx.property.findUnique({
          where: { id: entityId, createdById: userId },
        });
      } else {
        entity = await tx.project.findUnique({
          where: { id: entityId, createdById: userId },
        });
      }

      if (!entity) {
        throw new Error('Entity not found or access denied.');
      }

      const lastBump = await tx.promotion.findFirst({
        where: {
          userId,
          type: PromotionType.BUMP_UP,
          propertyId: entityType === 'PROPERTY' ? entityId : undefined,
          projectId: entityType === 'PROJECT' ? entityId : undefined,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (lastBump) {
        const lastBumpDate = new Date(lastBump.createdAt);
        const hoursSinceLastBump = (Date.now() - lastBumpDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastBump < COOLDOWN_HOURS) {
          throw new Error('Cooldown active');
        }
      }

      await EntitlementService.consume(userId, 'BUMP_UP_CREDIT', tx);

      if (entityType === 'PROPERTY') {
        await tx.property.update({
          where: { id: entityId },
          data: { updatedAt: new Date() },
        });
      } else {
        await tx.project.update({
          where: { id: entityId },
          data: { updatedAt: new Date() },
        });
      }

      await tx.promotion.create({
        data: {
          userId,
          type: PromotionType.BUMP_UP,
          status: PromotionStatus.ACTIVE,
          propertyId: entityType === 'PROPERTY' ? entityId : undefined,
          projectId: entityType === 'PROJECT' ? entityId : undefined,
        },
      });

      return { success: true };
    });
  }

  /**
   * Instantly terminates all active promotions if subscription expires.
   */
  static async terminatePromotionsOnSubscriptionExpiry(userId: number) {
    const activeSub = await prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (!activeSub) {
      await prisma.promotion.updateMany({
        where: {
          userId,
          status: PromotionStatus.ACTIVE,
        },
        data: {
          status: PromotionStatus.EXPIRED,
        },
      });
    }
  }

  /**
   * Checks the cooldown status for a property/project's Bump Up.
   */
  static async getCooldownStatus(entityId: number, userId: number, entityType: 'PROPERTY' | 'PROJECT' = 'PROPERTY') {
    const COOLDOWN_HOURS = 24;

    const lastBump = await prisma.promotion.findFirst({
      where: {
        userId,
        type: PromotionType.BUMP_UP,
        propertyId: entityType === 'PROPERTY' ? entityId : undefined,
        projectId: entityType === 'PROJECT' ? entityId : undefined,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastBump) return { isAvailable: true };

    const lastBumpDate = new Date(lastBump.createdAt);
    const msSinceLastBump = Date.now() - lastBumpDate.getTime();
    const hoursSinceLastBump = msSinceLastBump / (1000 * 60 * 60);
    
    if (hoursSinceLastBump >= COOLDOWN_HOURS) {
      return { isAvailable: true };
    }

    const remainingMs = (COOLDOWN_HOURS * 60 * 60 * 1000) - msSinceLastBump;
    return { 
      isAvailable: false, 
      remainingHours: Math.ceil(remainingMs / (1000 * 60 * 60)),
      remainingMs
    };
  }

  /**
   * Synchronizes promotion statuses (On-Activity State Flip).
   */
  static async syncPromotionStatuses(userId: number) {
    await prisma.promotion.updateMany({
      where: {
        userId,
        status: PromotionStatus.ACTIVE,
        expiresAt: { lt: new Date() }
      },
      data: {
        status: PromotionStatus.EXPIRED
      }
    });

    await this.terminatePromotionsOnSubscriptionExpiry(userId);
  }
}
