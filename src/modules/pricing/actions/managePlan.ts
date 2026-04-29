"use server";

import { revalidatePath } from "next/cache";
import { PricingService } from "../services/service";
import { listEntitlementDefinitionsAction } from "@/modules/entitlement/actions/entitlement.actions";

export async function getPlanAction(id: number) {
  try {
    return await PricingService.getPlan(id);
  } catch (error) {
    console.error("Failed to get plan:", error);
    return null;
  }
}

export async function getEntitlementDefinitionsAction() {
  const result = await listEntitlementDefinitionsAction();
  if (result.success) {
    return result.data;
  }
  return [];
}

export async function createPlanAction(data: any) {
  try {
    const result = await PricingService.createPlan(data);
    revalidatePath("/admin/pricing");
    return { success: true, data: result } as const;
  } catch (error: any) {
    console.error("Failed to create plan:", error);
    return { success: false, error: error.message || "Failed to create plan" } as const;
  }
}

export async function updatePlanAction(id: number, data: any) {
  try {
    const result = await PricingService.updatePlan(id, data);
    revalidatePath("/admin/pricing");
    return { success: true, data: result } as const;
  } catch (error: any) {
    console.error("Failed to update plan:", error);
    return { success: false, error: error.message || "Failed to update plan" } as const;
  }
}

export async function deletePlanAction(id: number) {
  try {
    const result = await PricingService.deletePlan(id);
    revalidatePath("/admin/pricing");
    return result;
  } catch (error) {
    console.error("Failed to delete plan:", error);
    return { success: false, error: "Failed to delete plan" } as const;
  }
}

export async function syncPlanAction(id: number) {
  try {
    const result = await PricingService.syncPlanStatus(id);
    revalidatePath("/admin/pricing");
    if (result.success) {
      return { 
        success: true, 
        isActive: result.status === "ACTIVE", 
        message: `Synced: Status is ${result.status}${result.priceSynced ? " (Price updated)" : ""}` 
      } as const;
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message } as const;
  }
}

export async function syncAllPlansAction() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const plans = await prisma.pricingPlan.findMany({
      where: { paypalPlanId: { not: null } },
      select: { id: true }
    });

    const results = await Promise.all(
      plans.map(p => PricingService.syncPlanStatus(p.id))
    );

    revalidatePath("/admin/pricing");
    const successCount = results.filter(r => r.success).length;
    return { 
      success: true, 
      message: `Successfully synced ${successCount} of ${plans.length} plans.` 
    } as const;
  } catch (error: any) {
    return { success: false, error: error.message } as const;
  }
}
