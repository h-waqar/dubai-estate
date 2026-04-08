"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { PromotionService } from "@/modules/promotions/services/promotion.service";
import { revalidatePath } from "next/cache";

export async function activatePromotionAction(propertyId: number, type: "SPOTLIGHT" | "FEATURED") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const userId = parseInt(session.user.id);
    const result = await PromotionService.activatePromotion(propertyId, userId, type);
    
    revalidatePath("/account/properties");
    revalidatePath("/");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to activate promotion" };
  }
}

export async function bumpUpPropertyAction(propertyId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const userId = parseInt(session.user.id);
    const result = await PromotionService.bumpUpProperty(propertyId, userId);
    
    revalidatePath("/account/properties");
    revalidatePath("/properties");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to bump up property" };
  }
}