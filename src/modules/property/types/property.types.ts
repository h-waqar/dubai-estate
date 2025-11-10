// src/modules/property/types/property.types.ts
import { z } from "zod";
import { createPropertyValidator } from "../validators/createProperty.validator";

// This is the output type - what we get AFTER validation/coercion
export type CreatePropertyInput = z.output<typeof createPropertyValidator>;

// Alternative: explicitly define the type for better clarity
export interface CreatePropertyFormData {
  title: string;
  price: number;
  propertyTypeId: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  furnishing: "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED";
  description?: string;
  coverImage: number;
  gallery?: number[];
}
