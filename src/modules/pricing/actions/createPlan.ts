"use server";

import { PricingService } from "../services/service";
import { CreatePricingInput, createPricingSchema } from "../validators/createPricing.validator";
import { revalidatePath } from "next/cache";

export async function createPlan(data: CreatePricingInput) {
  try {
    const validated = createPricingSchema.parse(data);
    const plan = await PricingService.createPlan(validated);
    revalidatePath("/admin/pricing");
    return { success: true, data: plan };
  } catch (error) {
    console.error("Failed to create plan:", error);
    return { success: false, error: "Failed to create plan" };
  }
}
