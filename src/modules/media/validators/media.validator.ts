// src/modules/media/validators/media.validator.ts
import { z } from "zod";

export const mediaUploadSchema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File, "Invalid file")
    .refine((file) => file.size <= 10_485_760, "File is too large (max 10MB)")
    .refine(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "video/mp4",
          "application/pdf",
        ].includes(file.type),
      "Unsupported file type"
    ),
  title: z.string().max(150).optional(),
  alt: z.string().max(150).optional(),
  type: z.enum(["IMAGE", "VIDEO", "DOCUMENT", "OTHER"]).optional(),
});
