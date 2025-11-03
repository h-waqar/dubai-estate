// src/modules/property/actions/createProperty.ts
"use server";

import { revalidatePath } from "next/cache";
import { createPropertyServerValidator } from "../validators/createProperty.validator";
import * as propertyService from "../services/service";
import { authOptions } from "@/modules/user/routes/auth";
import { getServerSession } from "next-auth";
import { serializeDecimals } from "@/lib/serializeDecimal";

export async function createPropertyAction(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (
    !session?.user?.id ||
    (session.user.role !== "ADMIN" && session.user.role !== "MANAGER")
  ) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Convert FormData to plain object
  const data = Object.fromEntries(formData);
  // 3. Validate using the SERVER validator (with z.coerce)
  const validation = createPropertyServerValidator.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.flatten().fieldErrors,
    };
  }
  // 4. Create property in database
  try {
    let property = await propertyService.createProperty(
      validation.data,
      session.user.id
    );

    // property = serializeDecimals(property);
    property = JSON.parse(JSON.stringify(property));

    revalidatePath("/properties");

    return { success: true, property };
  } catch (error) {
    console.error("Failed to create property:", error);
    // return { success: false, error: "Failed to create property." };
    return { success: false, error: String(error) };
  }
}
