"use server";

import { PricingService } from "../services/service";
import { revalidatePath } from "next/cache";
import { serializeDecimals } from "@/lib/serializeDecimal";

export async function listPlans() {
  try {
    const plans = await PricingService.listPlans();
    return serializeDecimals(plans);
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
