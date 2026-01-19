"use server";

import { PricingService } from "../services/service";
import { CreatePricingInput } from "../validators/createPricing.validator";
import { UpdatePricingInput } from "../validators/updatePricing.validator";
import { revalidatePath } from "next/cache";

export async function createPlanAction(data: CreatePricingInput) {
  try {
    console.log("Creating plan with data:", JSON.stringify(data, null, 2));
    const plan = await PricingService.createPlan(data);
    console.log("Plan created successfully:", plan);
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    console.error("Failed to create plan:", error);
    return { success: false, error: "Failed to create plan" };
  }
}

export async function updatePlanAction(id: number, data: UpdatePricingInput) {
  try {
    await PricingService.updatePlan(id, data);
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    console.error("Failed to update plan:", error);
    return { success: false, error: "Failed to update plan" };
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
