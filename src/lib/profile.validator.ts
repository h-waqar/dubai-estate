// src/lib/profile.validator.ts
import { z } from "zod";

/**
 * We add a new field 'coverImageId'.
 *
 * We make it 'optional()' so the form is valid
 * even if the user doesn't select an image.
 */
export const profileValidator = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Please enter a valid email address."),
  age: z
    .number({
      invalid_type_error: "Age is required.",
    })
    .min(18, "You must be at least 18 years old."),

  // --- NEW FIELD ---
  // This will store the 'id' of the selected media.
  coverImageId: z.number().optional(),
});

/**
 * Our 'ProfileInput' type is automatically updated
 * to include 'coverImageId?: number'.
 */
export type ProfileInput = z.infer<typeof profileValidator>;
