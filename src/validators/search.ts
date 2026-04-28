import { z } from "zod";

export const globalSearchSchema = z.object({
  query: z.string().min(2, "Search query must be at least 2 characters").max(100, "Search query is too long"),
  purpose: z.enum(["buy", "rent", "off_plan", "all"]).optional(),
});

export type GlobalSearchInput = z.infer<typeof globalSearchSchema>;
