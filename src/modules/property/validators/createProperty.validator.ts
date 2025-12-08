// src/modules/property/validators/createProperty.validator.ts
import { z } from "zod";
import { FurnishingStatus, ListingType } from "@/generated/prisma";
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
  furnishing: z.nativeEnum(FurnishingStatus),
  listingType: z.nativeEnum(ListingType).default(ListingType.SALE),
  description: z.string().optional(),
  coverImage: z.number("Cover imgae required").int().optional(),
  gallery: z
    .array(z.number().int().positive("Invalid image reference"))
    .optional(),
});

// export const createPropertyValidator = z.object({
//   title: z.string().min(10),
//   price: z.coerce.number().positive(),
//   propertyTypeId: z.coerce.number(),
//   bedrooms: z.coerce.number(),
//   bathrooms: z.coerce.number(),
//   location: z.string().min(3),
//   furnishing: z.enum(["FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"]),
//   description: z.string().optional(),
//   coverImage: z.coerce.number().optional(),
//   gallery: z.array(z.coerce.number()).optional(),
// });

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
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  furnishing: z.enum(FurnishingStatus),
  listingType: z.enum(["SALE", "RENT", "OFF_PLAN"]).default("SALE"),
  description: z.string().optional(),
  coverImage: z.coerce.number().optional(),
  gallery: z.array(z.coerce.number()).optional(),
  features: z.array(z.coerce.number()).optional(),
});
