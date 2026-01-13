"use server";

import { PricingService } from "../services/service";
import { CreatePricingInput } from "../validators/createPricing.validator";
import { UpdatePricingInput } from "../validators/updatePricing.validator";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPlanAction(data: CreatePricingInput) {
  try {
    await PricingService.createPlan(data);
    revalidatePath("/admin/pricing");
  } catch (error) {
    console.error("Failed to create plan:", error);
    return { success: false, error: "Failed to create plan" };
  }
  redirect("/admin/pricing");
}

export async function updatePlanAction(id: number, data: UpdatePricingInput) {
  try {
    await PricingService.updatePlan(id, data);
    revalidatePath("/admin/pricing");
  } catch (error) {
    console.error("Failed to update plan:", error);
    return { success: false, error: "Failed to update plan" };
  }
  redirect("/admin/pricing");
}

export async function getPlanAction(id: number) {
    try {
        return await PricingService.getPlan(id);
    } catch (error) {
        return null;
    }
}
