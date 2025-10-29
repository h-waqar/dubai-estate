// src/app/(frontend)/admin/blog/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { cookies } from "next/headers";
import BlogList from "@/modules/blog/components/BlogList";
import { authOptions } from "@/modules/user/routes/auth";

async function getPosts() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const res = await api.get("/posts", {
      headers: {
        Cookie: cookieHeader,
      },
    });
    return res.data;
  } catch (error: unknown) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export default async function BlogsPage() {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (!["ADMIN", "EDITOR", "WRITER"].includes(session.user.role)) {
    redirect("/unauthorized");
  }

  const posts = await getPosts();

  return (
    <div className="container mx-auto py-8 px-4">
      <BlogList initialPosts={posts} />
    </div>
  );
}
