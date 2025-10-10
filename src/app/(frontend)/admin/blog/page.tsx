// src\app\(frontend)\admin\blog\page.tsx
import Link from "next/link";

async function getPosts() {
  const res = await fetch("/api/posts");
  return res.json();
}

export default async function BlogsPage() {
  const posts = await getPosts();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Blog Posts</h1>
      <Link href="/admin/blog/new" className="text-blue-600 underline">
        + New Post
      </Link>
      <ul className="mt-4 space-y-2">
        {posts.map((p: any) => (
          <li key={p.id} className="border p-3 rounded">
            <Link
              href={`/admin/blog/edit/${p.id}`}
              className="font-medium hover:underline"
            >
              {p.title}
            </Link>
            <p className="text-sm text-gray-500">{p.slug}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
