import { z } from "zod";

export const CreateFeatureValidator = z.object({
  name: z.string().min(1, "Feature name is required"),
  category: z.string().optional(), // optional grouping (e.g. "Interior", "Outdoor")
});

export const UpdateFeatureValidator = CreateFeatureValidator.partial();
