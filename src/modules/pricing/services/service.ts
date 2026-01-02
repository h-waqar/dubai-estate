import { prisma } from "@/lib/prisma";
import { CreatePricingInput } from "../validators/createPricing.validator";
import { UpdatePricingInput } from "../validators/updatePricing.validator";

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

  static async createPlan(data: CreatePricingInput) {
    return prisma.pricingPlan.create({
      data: {
        ...data,
        priceMonthly: data.priceMonthly.toString(),
        priceYearly: data.priceYearly.toString(),
      },
    });
  }

  static async updatePlan(id: number, data: UpdatePricingInput) {
    return prisma.pricingPlan.update({
      where: { id },
      data: {
        ...data,
        priceMonthly: data.priceMonthly?.toString(),
        priceYearly: data.priceYearly?.toString(),
      },
    });
  }

  static async deletePlan(id: number) {
    return prisma.pricingPlan.delete({
      where: { id },
    });
  }
}
