import { z } from "zod";

export const contactFormSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
    // captchaToken is optional in the schema because we handle its requirement logic 
    // conditionally based on the environment variable in the server action.
    captchaToken: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
