import { prisma } from "@/lib/prisma";
import { CreatePricingInput } from "../validators/createPricing.validator";
import { UpdatePricingInput } from "../validators/updatePricing.validator";
import { PlanType } from "@prisma/client";

export class PricingService {
  static async listPlans() {
    return prisma.pricingPlan.findMany({
      orderBy: { priceMonthly: "asc" },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });
  }

  static async getPlan(id: number) {
    return prisma.pricingPlan.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });
  }

  static async getPlanBySlug(slug: string) {
    return prisma.pricingPlan.findUnique({
      where: { slug },
    });
  }

  static async createPlan(data: CreatePricingInput) {
    return prisma.pricingPlan.create({
      data: {
        ...data,
        type: data.type as PlanType,
        maxListings: data.maxListings ?? 3,
        priceMonthly: data.priceMonthly?.toString(),
        priceYearly: data.priceYearly?.toString(),
        priceOneTime: data.priceOneTime?.toString(),
      },
    });
  }

  static async updatePlan(id: number, data: UpdatePricingInput) {
    return prisma.pricingPlan.update({
      where: { id },
      data: {
        ...data,
        type: data.type as PlanType,
        priceMonthly: data.priceMonthly?.toString(),
        priceYearly: data.priceYearly?.toString(),
        priceOneTime: data.priceOneTime?.toString(),
      },
    });
  }

  static async deletePlan(id: number) {
    return prisma.pricingPlan.delete({
      where: { id },
    });
  }

  static async getSubscribers() {
    return prisma.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        plan: {
            select: {
                name: true,
                priceMonthly: true,
                priceYearly: true,
                type: true,
                priceOneTime: true
            }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}