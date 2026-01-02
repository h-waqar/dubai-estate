import { z } from "zod";
import { createPricingSchema } from "./createPricing.validator";

export const updatePricingSchema = createPricingSchema.partial();

export type UpdatePricingInput = z.infer<typeof updatePricingSchema>;
