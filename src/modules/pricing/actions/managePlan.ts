"use server";

import { PricingService } from "../services/service";
import { createPricingSchema, CreatePricingInput } from "../validators/createPricing.validator";
import { UpdatePricingInput } from "../validators/updatePricing.validator";
import { revalidatePath } from "next/cache";

export async function createPlanAction(data: CreatePricingInput) {
  try {
    console.log("Creating plan with data:", JSON.stringify(data, null, 2));
    
    // Validate on the server
    const validatedData = createPricingSchema.parse(data);

    // Check uniqueness early to provide clear errors
    const { prisma } = await import("@/lib/prisma");
    const existingName = await prisma.pricingPlan.findUnique({ where: { name: validatedData.name } });
    if (existingName) return { success: false, error: `Plan with name '${validatedData.name}' already exists.` };
    
    const existingSlug = await prisma.pricingPlan.findUnique({ where: { slug: validatedData.slug } });
    if (existingSlug) return { success: false, error: `slug '${validatedData.slug}' is already in use by another plan.` };

    const plan = await PricingService.createPlan(validatedData);
    console.log("Plan created successfully:", plan);
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create plan:", error);
    if (error?.name === 'ZodError') {
      return { success: false, error: "Validation failed: " + error.errors.map((e: any) => e.message).join(", ") };
    }
    return { success: false, error: error.message || "Failed to create plan. See server log." };
  }
}

export async function updatePlanAction(id: number, data: UpdatePricingInput) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const { updatePricingSchema } = await import("../validators/updatePricing.validator");
    const validatedData = updatePricingSchema.parse(data);

    // Uniqueness checks, excluding current plan
    const existingName = await prisma.pricingPlan.findFirst({ where: { name: validatedData.name, id: { not: id } } });
    if (existingName) return { success: false, error: `Plan with name '${validatedData.name}' already exists.` };
    
    const existingSlug = await prisma.pricingPlan.findFirst({ where: { slug: validatedData.slug, id: { not: id } } });
    if (existingSlug) return { success: false, error: `slug '${validatedData.slug}' is already in use by another plan.` };

    await PricingService.updatePlan(id, validatedData);
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update plan:", error);
    if (error?.name === 'ZodError') {
      return { success: false, error: "Validation failed: " + error.errors.map((e: any) => e.message).join(", ") };
    }
    return { success: false, error: error.message || "Failed to update plan. See server log." };
  }
}

export async function getPlanAction(id: number) {
    try {
        return await PricingService.getPlan(id);
    } catch (error) {
        return null;
    }
}

export async function deletePlanAction(id: number) {
  try {
    const result = await PricingService.deletePlan(id);
    revalidatePath("/admin/pricing");
    return result;
  } catch (error) {
    console.error("Failed to delete plan:", error);
    return { success: false, error: "Failed to delete plan" };
  }
}

export async function syncPlanAction(id: number) {
  try {
    const result = await PricingService.syncPlanStatus(id);
    revalidatePath("/admin/pricing");
    if (result.success) {
      return { success: true, isActive: result.status === "ACTIVE", message: `Synced: Status is ${result.status}${result.priceSynced ? " (Price updated)" : ""}` };
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function syncAllPlansAction() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const plans = await prisma.pricingPlan.findMany({
      where: { type: "SUBSCRIPTION", paypalPlanId: { not: null } }
    });

    let successCount = 0;
    for (const plan of plans) {
      const result = await PricingService.syncPlanStatus(plan.id);
      if (result.success) successCount++;
    }

    revalidatePath("/admin/pricing");
    return { success: true, message: `Successfully synced ${successCount} out of ${plans.length} plans.` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getEntitlementDefinitionsAction() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.entitlementDefinition.findMany();
  } catch (error) {
    console.error("Failed to fetch definitions", error);
    return [];
  }
}
