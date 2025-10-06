// src/validators/postUpdate.ts
import {z} from "zod";

export const postUpdateSchema = z.object({
    title: z.string().min(3).optional(),
    content: z.string().min(10).optional(),
    excerpt: z.string().optional(),
    slug: z.string().optional(),
    coverImage: z.string().url().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
