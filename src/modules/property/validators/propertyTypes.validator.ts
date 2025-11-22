import { z } from "zod";

export const propertyTypeSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(60),
  description: z.string().optional(),
});

export const propertyTypeUpdateSchema = propertyTypeSchema.extend({
  id: z.number(),
});

export type PropertyTypeInput = z.infer<typeof propertyTypeSchema>;
export type PropertyTypeUpdateInput = z.infer<typeof propertyTypeUpdateSchema>;
