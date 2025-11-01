import { z } from "zod";
import { createPropertyValidator } from "../validators/createProperty.validator";

export type CreatePropertyInput = z.infer<typeof createPropertyValidator>;
