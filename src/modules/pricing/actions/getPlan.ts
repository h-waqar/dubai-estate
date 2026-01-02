"use server";

import { PricingService } from "../services/service";

export async function getPlan(id: number) {
  try {
    return await PricingService.getPlan(id);
  } catch (error) {
    console.error("Failed to get plan:", error);
    return null;
  }
}
