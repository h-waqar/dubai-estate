import { z } from "zod";
import { FurnishingStatus } from "@/generated/prisma";

export const createPropertyValidator = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long."),
  price: z.coerce.number().positive("Price must be a positive number."),
  propertyTypeId: z.coerce.number().int().positive(),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  location: z.string().min(5, "Location is required."),
  furnishing: z.enum(FurnishingStatus).default("UNFURNISHED"),
  description: z.string().optional(),
});
