import z from "zod";

export const propertyTypeSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().optional(), // Auto-generated
    description: z.string().optional(),
});

export type PropertyTypeInput = z.infer<typeof propertyTypeSchema>;

export const propertyTypeUpdateSchema = propertyTypeSchema.partial();
export type PropertyTypeUpdateInput = z.infer<typeof propertyTypeUpdateSchema>;
