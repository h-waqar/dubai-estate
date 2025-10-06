import {z} from "zod";

export const postSchema = z.object({
    title: z.string().min(3, "Title is too short"),
    content: z.string().min(10, "Content is too short"),
    excerpt: z.string().optional(),
    slug: z.string().optional(),
    coverImage: z.string().url("Invalid image URL").optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    authorId: z.number().optional(),
});

export type PostInput = z.infer<typeof postSchema>;
