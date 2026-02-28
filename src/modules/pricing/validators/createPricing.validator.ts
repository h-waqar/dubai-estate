import { z } from "zod";

export const createPricingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  type: z.enum(["SUBSCRIPTION", "ONE_TIME"]).default("SUBSCRIPTION"),
  priceMonthly: z.number().min(0, "Price cannot be negative").optional(),
  priceYearly: z.number().min(0, "Price cannot be negative").optional(),
  priceOneTime: z.number().min(0, "Price cannot be negative").optional(),
  isActive: z.boolean(),
  paypalPlanId: z.string().optional(),
  paypalProductId: z.string().optional(),
  entitlements: z.array(z.object({
    definitionId: z.string(),
    amount: z.number().int().min(0, "Amount cannot be negative")
  })).optional().default([]),
});

export type CreatePricingInput = z.infer<typeof createPricingSchema>;