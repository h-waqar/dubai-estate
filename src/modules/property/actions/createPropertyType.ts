"use server";

import { propertyTypeSchema } from "@/modules/property/validators/propertyTypes.validator";
import { PropertyTypeService } from "@/modules/property/services/propertyType";

export async function createPropertyType(form: FormData) {
  const parsed = propertyTypeSchema.safeParse({
    name: form.get("name"),
    slug: form.get("slug"),
    description: form.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const result = await PropertyTypeService.create(parsed.data);
    return { data: result };
  } catch (err) {
    return { error: "Failed to create property type" };
  }
}
