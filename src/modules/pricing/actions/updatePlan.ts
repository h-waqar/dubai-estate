"use server";

import { PricingService } from "../services/service";
import { UpdatePricingInput, updatePricingSchema } from "../validators/updatePricing.validator";
import { revalidatePath } from "next/cache";

export async function updatePlan(id: number, data: UpdatePricingInput) {
  try {
    const validated = updatePricingSchema.parse(data);
    const plan = await PricingService.updatePlan(id, validated);
    revalidatePath("/admin/pricing");
    return { success: true, data: plan };
  } catch (error) {
    console.error("Failed to update plan:", error);
    return { success: false, error: "Failed to update plan" };
  }
}
