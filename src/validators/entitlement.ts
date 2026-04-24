import { z } from "zod";

export const entitlementDefinitionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required").toUpperCase(),
  description: z.string().optional(),
});

export type EntitlementDefinitionInput = z.infer<typeof entitlementDefinitionSchema>;
