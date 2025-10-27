// src\app\(frontend)\admin\blog\edit\[id]\page.tsx

import { PostForm } from "@/modules/blog/components/PostForm";
import { Category } from "@/modules/blog/types/category.types";
import { api } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";

async function getPost(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/${id}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await api.get("/categories");
    return res.data.data;
  } catch (error: unknown) {
    console.error("Failed to fetch categories:", error);
    // Since this is a frontend component, we'll just return an empty array
    // and let the component handle the empty state or display a message.
    return [];
  }
}

export default async function EditPost({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // Handle unauthenticated user
    return null;
  }
  const post = await getPost(params.id);
  const categories = await getCategories();
  return <PostForm initialData={post} categories={categories} />;
}
