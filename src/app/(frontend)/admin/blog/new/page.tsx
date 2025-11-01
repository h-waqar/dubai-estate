// src/app/(frontend)/admin/blog/new/page.tsx
import { PostForm } from "@/modules/blog/components/PostForm";
import { api } from "@/lib/api";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { Category } from "@/modules/blog/types/category.types";

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

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (!["ADMIN", "EDITOR", "WRITER"].includes(session.user.role)) {
    redirect("/unauthorized");
  }

  const categories = await getCategories();

  return (
    <div className="container mx-auto py-8 px-4">
      <PostForm categories={categories} />
    </div>
  );
}
