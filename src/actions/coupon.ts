"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { couponService } from "@/modules/coupon/coupon.service";
import { createCouponSchema, updateCouponSchema } from "@/validators/coupon";
import { revalidatePath } from "next/cache";

function parseCouponFormData(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  
  const payload: any = {
      code: rawData.code,
      type: rawData.type,
      value: rawData.value ? Number(rawData.value) : undefined,
      maxUsage: rawData.maxUsage ? Number(rawData.maxUsage) : null,
      perUserLimit: rawData.perUserLimit ? Number(rawData.perUserLimit) : null,
      validFrom: rawData.validFrom ? new Date(rawData.validFrom as string) : null,
      validTo: rawData.validTo ? new Date(rawData.validTo as string) : null,
      isActive: rawData.isActive === 'true' || rawData.isActive === 'on',
      appliesToAllPlans: rawData.appliesToAllPlans === 'true' || rawData.appliesToAllPlans === 'on',
  };

  const planIds = formData.getAll('planIds').map(id => Number(id));
  if (planIds.length > 0) {
      payload.planIds = planIds;
  } else if (payload.appliesToAllPlans === false) {
      payload.planIds = [];
  }

  return payload;
}

export async function createCouponAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || (!session.user.roles.includes("ADMIN") && !session.user.roles.includes("SUPER_ADMIN"))) {
      return { error: "Unauthorized" };
  }

  const payload = parseCouponFormData(formData);
  const validation = createCouponSchema.safeParse(payload);

  if (!validation.success) {
      return { error: validation.error.flatten().fieldErrors };
  }

  try {
      await couponService.createCoupon(validation.data);
      revalidatePath("/admin/finance/coupons");
      return { success: true };
  } catch (e: any) {
      console.error("Create Coupon Error:", e);
      return { error: "Failed to create coupon: " + e.message };
  }
}

export async function updateCouponAction(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || (!session.user.roles.includes("ADMIN") && !session.user.roles.includes("SUPER_ADMIN"))) {
      return { error: "Unauthorized" };
  }

  const payload = parseCouponFormData(formData);
  // Remove fields that might be empty strings if not updated
  Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

  const validation = updateCouponSchema.safeParse(payload);

  if (!validation.success) {
      return { error: validation.error.flatten().fieldErrors };
  }

  try {
      await couponService.updateCoupon(id, validation.data);
      revalidatePath("/admin/finance/coupons");
      return { success: true };
  } catch (e: any) {
      console.error("Update Coupon Error:", e);
      return { error: "Failed to update coupon: " + e.message };
  }
}

export async function deleteCouponAction(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || (!session.user.roles.includes("ADMIN") && !session.user.roles.includes("SUPER_ADMIN"))) {
      return { error: "Unauthorized" };
  }

  try {
      await couponService.deleteCoupon(id);
      revalidatePath("/admin/finance/coupons");
      return { success: true };
  } catch (e: any) {
       console.error("Delete Coupon Error:", e);
       return { error: "Failed to delete coupon" };
  }
}

export async function validateCouponAction(code: string, planId?: number) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
      return { error: "You must be logged in to apply a coupon" };
  }

  try {
      const coupon = await couponService.validateCoupon(code, session.user.id, planId);
      return { 
          success: true, 
          coupon: {
              ...coupon,
              value: Number(coupon.value), // Serialize Decimal
              // Serialize Dates if needed, Next.js server actions handle Dates usually
          } 
      };
  } catch (e: any) {
      return { error: e.message };
  }
}
