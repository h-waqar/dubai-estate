"use server";

import { getPublishedPosts } from "@/modules/blog/services/post.service";

export async function fetchPosts(options: {
  category?: string;
  limit?: number;
  page?: number;
  search?: string;
}) {
  return await getPublishedPosts(options);
}
