import { z } from "zod";

export const callbackRequestSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  phone: z.string().min(10, "A valid phone number is required"),
  email: z.email("Invalid email address"),
  preferredTime: z.string().optional(),
  contactMethod: z.enum(["Phone", "Email"], {
    message: "Please select a contact method",
  }),
  purchasePurpose: z.string().optional(),
  budget: z.number().optional(),
  location: z.string().optional(),
  message: z.string().optional(),
});
export type CallbackRequestInput = z.infer<typeof callbackRequestSchema>;
