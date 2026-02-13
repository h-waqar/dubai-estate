"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createPropertyServerValidator } from "../validators/createProperty.validator";
import * as propertyService from "../services/createProperty";
import { authOptions } from "@/modules/user/routes/auth";
import { getServerSession } from "next-auth";
import { checkQuota } from "./checkQuota";

export async function createPropertyAction(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  // 1. Check Quota
  const quota = await checkQuota();
  if (!quota.allowed) {
      return { success: false, error: quota.error || "Quota Exceeded" };
  }

  const initialStatus = "PENDING_REVIEW";

  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    propertyTypeId: formData.get("propertyTypeId"),
    bedrooms: formData.get("bedrooms"),
    bathrooms: formData.get("bathrooms"),
    location: formData.get("location"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    furnishing: formData.get("furnishing"),
    listingType: formData.get("listingType"),
    description: formData.get("description") || "",
    coverImage: formData.get("coverImage"),
    gallery: formData.getAll("gallery[]"),
    features: formData.getAll("features[]"),
    developerId: formData.get("developerId") ? Number(formData.get("developerId")) : undefined,
    proposedDeveloperName: formData.get("proposedDeveloperName")?.toString() || undefined,
  };
  
  const validation = createPropertyServerValidator.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      let property = await propertyService.createProperty(
        {
          ...validation.data,
          status: initialStatus,
          published: false, 
        },
        session.user.id,
        tx
      );
      return JSON.parse(JSON.stringify(property));
    });

    revalidatePath("/properties");
    revalidatePath("/account"); // Update quota in dashboard
    return { success: true, property: result };
  } catch (error) {
    console.error("Failed to create property:", error);
    return { success: false, error: String(error) };
  }
}