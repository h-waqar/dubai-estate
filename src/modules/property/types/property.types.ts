// src/modules/property/types/property.types.ts
import { z } from "zod";
import { createPropertyValidator } from "../validators/createProperty.validator";

// This is the output type - what we get AFTER validation/coercion
export type CreatePropertyInput = z.output<typeof createPropertyValidator>;

