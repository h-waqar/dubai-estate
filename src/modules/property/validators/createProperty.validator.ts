// src/modules/property/validators/createProperty.validator.ts
import { z } from "zod";
import { FurnishingStatus } from "@/generated/prisma";
export const createPropertyValidator = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long."),
  price: z
    .number("Price is required")
    .positive("Price must be a positive number.")
    .max(9999999999.99, "Price too large"),
  propertyTypeId: z.number("Property type is required").int().positive(),
  bedrooms: z.number("Bedrooms is required").int().min(0),
  bathrooms: z.number("Bathrooms is required").int().min(0),
  location: z.string().min(5, "Location is required."),
  furnishing: z.enum(FurnishingStatus),
  // furnishing: z.nativeEnum(FurnishingStatus).default("UNFURNISHED"),

  description: z.string().optional(),
});

export const createPropertyServerValidator = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long."),

  price: z.coerce
    .number()
    .positive("Price must be a positive number.")
    .max(9999999999.99, "Price too large"),

  propertyTypeId: z.coerce.number().int().positive(),

  bedrooms: z.coerce.number().int().min(0),

  bathrooms: z.coerce.number().int().min(0),

  location: z.string().min(5, "Location is required."),

  furnishing: z.enum(FurnishingStatus),
  // furnishing: z.nativeEnum(FurnishingStatus).default("UNFURNISHED"),

  description: z.string().optional(),
});
