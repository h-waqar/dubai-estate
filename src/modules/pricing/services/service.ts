import { prisma } from "@/lib/prisma";
import { CreatePricingInput } from "../validators/createPricing.validator";
import { UpdatePricingInput } from "../validators/updatePricing.validator";
import { PlanType } from "@prisma/client";
import { createPayPalProduct, createPayPalPlan, deactivatePayPalPlan } from "@/lib/paypal-api";

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
        entitlements: true,
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
    let paypalProductId = data.paypalProductId;
    let paypalPlanId = data.paypalPlanId;

    // Automatically create PayPal resources if it's a subscription and IDs are missing
    if (data.type === "SUBSCRIPTION" && !paypalPlanId && data.priceMonthly) {
      try {
        // 1. Create Product if needed
        if (!paypalProductId) {
          const product = await createPayPalProduct(data.name, data.description || "Subscription Plan");
          paypalProductId = product.id;
        }

        // 2. Create Plan
        if (paypalProductId) {
            const plan = await createPayPalPlan(
                paypalProductId,
                data.name,
                data.description || "Monthly Subscription",
                data.priceMonthly.toString()
            );
            paypalPlanId = plan.id;
        }
      } catch (error) {
        console.error("Auto-creation of PayPal resources failed:", error);
        // We continue creating the local plan, but maybe log a warning or could verify if we should throw.
        // For now, let's allow partial creation so the admin isn't blocked, but IDs will be null.
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
        paypalPlanId: paypalPlanId,
        paypalProductId: paypalProductId,
        ...(entitlements && entitlements.length > 0 && {
          entitlements: {
            create: entitlements.map(e => ({
              definitionId: e.definitionId,
              amount: e.amount
            }))
          }
        })
      },
    }).then(plan => {
        console.log("Prisma create result:", plan);
        return plan;
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
            deleteMany: {}, // replace all existing entitlements
            create: entitlements.map(e => ({
              definitionId: e.definitionId,
              amount: e.amount
            }))
          }
        })
      },
    });
  }

  static async deletePlan(id: number) {
    const plan = await prisma.pricingPlan.findUnique({ where: { id } });
    if (!plan) return { success: false, error: "Plan not found" };

    // 1. Check for existing subscriptions
    const subCount = await prisma.subscription.count({ where: { planId: id } });
    if (subCount > 0) {
        return { success: false, error: `Cannot delete plan with ${subCount} associated subscriptions. Please archive (deactivate) it instead.` };
    }

    // 2. Determine PayPal Plan ID (DB or Legacy Env)
    let paypalIdToDeactivate: string | null | undefined = plan.paypalPlanId;
    if (!paypalIdToDeactivate) {
        if (plan.slug === "silver") paypalIdToDeactivate = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER;
        else if (plan.slug === "gold") paypalIdToDeactivate = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD;
    }
    
    // 3. Deactivate on PayPal
    if (paypalIdToDeactivate) {
        try {
            await deactivatePayPalPlan(paypalIdToDeactivate);
            console.log(`Deactivated PayPal Plan: ${paypalIdToDeactivate}`);
        } catch (error) {
            console.error(`Failed to deactivate PayPal plan ${paypalIdToDeactivate}`, error);
            // Continue with local deletion even if remote fails (it might already be inactive or invalid)
        }
    }

    // 4. Delete from DB
    try {
        await prisma.pricingPlan.delete({
            where: { id },
        });
        return { success: true };
    } catch (error) {
        console.error("Delete Plan Error:", error);
        return { success: false, error: "Database error while deleting plan." };
    }
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