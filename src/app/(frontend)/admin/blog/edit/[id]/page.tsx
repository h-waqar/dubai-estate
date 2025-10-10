// src\app\(frontend)\admin\blog\edit\[id]\page.tsx

import { PostForm } from "@/components/posts/PostForm";

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

export default async function EditPost({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  return <PostForm initialData={post} />;
}
