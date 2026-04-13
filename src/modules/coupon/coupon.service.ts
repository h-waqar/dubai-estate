import { prisma } from "@/lib/prisma";
import { createCouponSchema, updateCouponSchema } from "@/validators/coupon";
import { z } from "zod";
import { CouponType } from "@prisma/client";

export class CouponService {
  async createCoupon(data: z.infer<typeof createCouponSchema>) {
    if (!prisma.coupon) throw new Error("Prisma Coupon model is undefined. Please restart the server.");
    return await prisma.coupon.create({
      data: {
        name: data.name,
        code: data.code,
        type: data.type,
        value: data.value,
        maxUsage: data.maxUsage,
        perUserLimit: data.perUserLimit,
        validFrom: data.validFrom,
        validTo: data.validTo,
        isActive: data.isActive,
        appliesToAllPlans: data.appliesToAllPlans,
        planIds: data.planIds || [],
      },
    });
  }

  async updateCoupon(id: string, data: z.infer<typeof updateCouponSchema>) {
    if (!prisma.coupon) throw new Error("Prisma Coupon model is undefined. Please restart the server.");
    return await prisma.coupon.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async deleteCoupon(id: string) {
    if (!prisma.coupon) throw new Error("Prisma Coupon model is undefined. Please restart the server.");
    return await prisma.coupon.delete({
      where: { id },
    });
  }

  async listCoupons() {
    if (!prisma.coupon) {
      console.warn("Prisma Coupon model is undefined. Returning empty list.");
      return [];
    }
    return await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCouponByCode(code: string) {
    if (!prisma.coupon) return null;
    return await prisma.coupon.findUnique({
      where: { code },
    });
  }

  async validateCoupon(code: string, userId: number, planId?: number, intent?: "SUBSCRIPTION" | "ADDON") {
    const coupon = await this.getCouponByCode(code);
    
    if (!coupon) {
      throw new Error("Invalid coupon code");
    }

    if (!coupon.isActive) {
        throw new Error("Coupon is inactive");
    }

    const now = new Date();
    if (coupon.validFrom && coupon.validFrom > now) {
        throw new Error("Coupon is not yet valid");
    }
    if (coupon.validTo && coupon.validTo < now) {
        throw new Error("Coupon has expired");
    }

    if (coupon.maxUsage !== null && coupon.usedCount >= coupon.maxUsage) {
        throw new Error("Coupon usage limit reached");
    }

    // Plan check
    if (!coupon.appliesToAllPlans && planId) {
        if (!coupon.planIds.includes(planId)) {
            throw new Error("Coupon not applicable to this plan");
        }
    }

    // Target Type Check
    if (intent) {
        if (coupon.targetType !== "ALL" && coupon.targetType !== intent) {
            throw new Error(`This coupon is only valid for ${coupon.targetType.toLowerCase()}s`);
        }
    }

    // Per user limit check
    if (coupon.perUserLimit !== null) {
        const userUsage = await prisma.subscription.count({
            where: {
                userId,
                couponId: coupon.id,
            }
        });
        if (userUsage >= coupon.perUserLimit) {
            throw new Error("You have reached the usage limit for this coupon");
        }
    }

    return coupon;
  }
}

export const couponService = new CouponService();
