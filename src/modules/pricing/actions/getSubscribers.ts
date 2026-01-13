"use server";

import { PricingService } from "../services/service";

export async function getSubscribers() {
  try {
    return await PricingService.getSubscribers();
  } catch (error) {
    console.error("Failed to get subscribers:", error);
    return [];
  }
}
