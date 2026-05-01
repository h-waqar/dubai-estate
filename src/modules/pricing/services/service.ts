import { prisma } from "@/lib/prisma";
import { CreatePricingInput } from "../validators/createPricing.validator";
import { UpdatePricingInput } from "../validators/updatePricing.validator";
import { PlanType } from "@prisma/client";
import { createPayPalProduct, createPayPalPlan, deactivatePayPalPlan, getPayPalPlanDetails } from "@/lib/paypal-api";

export class PricingService {
  static async listPlans() {
    return prisma.pricingPlan.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        entitlements: { include: { definition: true } },
        _count: { select: { users: true } }
      }
    });
  }

  static async syncPlanStatus(id: number) {
    const plan = await prisma.pricingPlan.findUnique({ where: { id } });
    if (!plan || !plan.paypalPlanId) {
      return { success: false, error: "Plan or PayPal ID not found" };
    }

    try {
      const paypalPlan = await getPayPalPlanDetails(plan.paypalPlanId);
      const isActive = paypalPlan.status === "ACTIVE";
      
      // Sync price from PayPal
      const paypalPrice = paypalPlan.billing_cycles?.[0]?.pricing_scheme?.fixed_price?.value;
      
      await prisma.pricingPlan.update({
        where: { id },
        data: { 
          isActive,
          ...(paypalPrice && { priceMonthly: paypalPrice })
        }
      });

      return { success: true, status: paypalPlan.status, priceSynced: !!paypalPrice };
    } catch (error: any) {
      console.error(`[PricingService.syncPlanStatus] Error for plan ${id}:`, error);
      const message = error.response?.data?.message || error.message;
      return { success: false, error: `PayPal Sync Failed: ${message}` };
    }
  }

  static async getPlan(id: number) {
    return prisma.pricingPlan.findUnique({
      where: { id },
      include: {
        entitlements: { include: { definition: true } },
        _count: { select: { users: true } }
      }
    });
  }

  static async getPlanBySlug(slug: string) {
    return prisma.pricingPlan.findUnique({
      where: { slug },
      include: {
        entitlements: { include: { definition: true } }
      }
    });
  }

  static async createPlan(data: CreatePricingInput) {
    let paypalProductId = data.paypalProductId;
    let paypalPlanId = data.paypalPlanId;

    if (data.type === "SUBSCRIPTION" && !paypalPlanId && data.priceMonthly) {
      try {
        if (!paypalProductId) {
          const product = await createPayPalProduct(data.name, data.description || "Subscription Plan");
          paypalProductId = product.id;
        }
        if (paypalProductId) {
            const plan = await createPayPalPlan(paypalProductId, data.name, data.description || "Monthly Subscription", data.priceMonthly.toString());
            paypalPlanId = plan.id;
        }
      } catch (error) {
        console.error("PayPal Error:", error);
      }
    }

    const { entitlements, ...restData } = data;
    return prisma.pricingPlan.create({
      data: {
        ...restData,
        type: data.type as PlanType,
        priceMonthly: data.priceMonthly?.toString(),
        priceYearly: data.priceYearly?.toString(),
        priceOneTime: data.priceOneTime?.toString(),
        paypalPlanId,
        paypalProductId,
        ...(entitlements && entitlements.length > 0 && {
          entitlements: {
            create: entitlements.map(e => ({ definitionId: e.definitionId, amount: e.amount }))
          }
        })
      }
    });
  }

  static async updatePlan(id: number, data: UpdatePricingInput) {
    const { entitlements, ...restData } = data;
    return prisma.pricingPlan.update({
      where: { id },
      data: {
        ...restData,
        type: data.type as PlanType,
        priceMonthly: data.priceMonthly?.toString(),
        priceYearly: data.priceYearly?.toString(),
        priceOneTime: data.priceOneTime?.toString(),
        paypalPlanId: data.paypalPlanId,
        paypalProductId: data.paypalProductId,
        ...(entitlements && {
          entitlements: {
            deleteMany: {},
            create: entitlements.map(e => ({ definitionId: e.definitionId, amount: e.amount }))
          }
        })
      }
    });
  }

  static async deletePlan(id: number) {
    const plan = await prisma.pricingPlan.findUnique({ where: { id } });
    if (!plan) return { success: false, error: "Plan not found" };
    const subCount = await prisma.subscription.count({ where: { planId: id } });
    if (subCount > 0) return { success: false, error: `Cannot delete plan with ${subCount} subscriptions.` };
    if (plan.paypalPlanId) {
        try { await deactivatePayPalPlan(plan.paypalPlanId); } catch (e) { console.error(e); }
    }
    await prisma.pricingPlan.delete({ where: { id } });
    return { success: true };
  }

  static async getSubscribers() {
    return prisma.subscription.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: { select: { name: true, priceMonthly: true, priceYearly: true, type: true, priceOneTime: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
