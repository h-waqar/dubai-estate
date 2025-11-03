// src/modules/property/types/property.types.ts
import { z } from "zod";
import { createPropertyValidator } from "../validators/createProperty.validator";

/**
 * Type definitions for property creation
 *
 * Important distinction:
 * - z.infer: Gets the INPUT type (what goes into validation)
 * - z.output: Gets the OUTPUT type (what comes out after validation)
 *
 * For forms with z.coerce, we need the OUTPUT type because
 * the form will send strings that get coerced to numbers
 */

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
}
