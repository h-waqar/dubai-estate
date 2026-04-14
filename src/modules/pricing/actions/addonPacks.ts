"use server";

import { AddonPackService } from "../services/addonPack.service";
import { revalidatePath } from "next/cache";
import { serializeDecimals } from "@/lib/serializeDecimal";

export async function listAddonPacksAction() {
  try {
    const packs = await AddonPackService.listPacks();
    return { success: true, packs: serializeDecimals(packs) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createAddonPackAction(data: { qty: number; label: string; discount: number; order?: number }) {
  try {
    await AddonPackService.createPack(data);
    revalidatePath("/admin/pricing");
    revalidatePath("/pricing");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAddonPackAction(id: number, data: { qty?: number; label?: string; discount?: number; order?: number; isActive?: boolean }) {
  try {
    await AddonPackService.updatePack(id, data);
    revalidatePath("/admin/pricing");
    revalidatePath("/pricing");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAddonPackAction(id: number) {
  try {
    await AddonPackService.deletePack(id);
    revalidatePath("/admin/pricing");
    revalidatePath("/pricing");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
