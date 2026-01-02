"use server";

import { PricingService } from "../services/service";
import { revalidatePath } from "next/cache";

export async function listPlans() {
  try {
    return await PricingService.listPlans();
  } catch (error) {
    console.error("Failed to list plans:", error);
    return [];
  }
}

export async function deletePlan(id: number) {
  try {
    await PricingService.deletePlan(id);
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete plan:", error);
    return { success: false, error: "Failed to delete plan" };
  }
}
