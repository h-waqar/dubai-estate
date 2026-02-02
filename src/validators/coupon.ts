import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(20, "Code must be at most 20 characters").regex(/^[a-zA-Z0-9_-]+$/, "Code must be alphanumeric"),
  type: z.enum(["PERCENTAGE", "FIXED", "TRIAL"]),
  value: z.number().positive("Value must be positive"),
  maxUsage: z.number().int().positive().optional().nullable(),
  perUserLimit: z.number().int().positive().optional().nullable(),
  validFrom: z.date().optional().nullable(),
  validTo: z.date().optional().nullable(),
  isActive: z.boolean(),
  appliesToAllPlans: z.boolean(),
  planIds: z.array(z.number()),
});

export const updateCouponSchema = createCouponSchema.partial();

export const validateCouponSchema = z.object({
  code: z.string().min(1, "Code is required"),
  planId: z.number().optional(),
});
