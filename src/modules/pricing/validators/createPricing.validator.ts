import { z } from "zod";

export const createPricingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  maxListings: z.number().int().min(1, "Must allow at least 1 listing"),
  priceMonthly: z.number().min(0, "Price cannot be negative"),
  priceYearly: z.number().min(0, "Price cannot be negative"),
  isActive: z.boolean(),
});

export type CreatePricingInput = z.infer<typeof createPricingSchema>;
