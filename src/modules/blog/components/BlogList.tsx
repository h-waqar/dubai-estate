// src/components/posts/BlogList.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Edit,
  Trash2,
  Eye,
  Copy,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Author {
  id: number;
  name: string | null;
  email: string | null;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

interface BlogListProps {
  initialPosts: Post[];
}

const ITEMS_PER_PAGE = 10;

export default function BlogList({ initialPosts }: BlogListProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Extract unique categories from posts
  const categories = Array.from(
    new Set(posts.map((p) => p.category).filter(Boolean))
  );

  // Filter posts based on search and filters
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || post.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && post.published) ||
      (statusFilter === "draft" && !post.published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Actions
  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p.id !== id));
      toast.success("Post deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      const response = await api.put(`/posts/${id}`, {
        published: !currentStatus,
      });
      setPosts(
        posts.map((p) =>
          p.id === id ? { ...p, published: !currentStatus } : p
        )
      );
      toast.success(
        `Post ${!currentStatus ? "published" : "unpublished"} successfully`
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to update post status");
      console.error(error);
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      setIsLoading(true);
      // Use dedicated duplicate endpoint
      const response = await api.post(`/posts/${id}/duplicate`);
      setPosts([response.data, ...posts]);
      toast.success("Post duplicated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to duplicate post");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog content and articles
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="gap-2">
            <span>+</span> New Post
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat!}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <p className="text-2xl font-bold">{posts.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="text-2xl font-bold text-green-600">
            {posts.filter((p) => p.published).length}
          </p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Drafts</p>
          <p className="text-2xl font-bold text-orange-600">
            {posts.filter((p) => !p.published).length}
          </p>
        </div>
      </div>

      {/* Posts Table */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4 font-medium">Post</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Tags</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Author</th>
                <th className="text-left p-4 font-medium">Updated</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-8 text-muted-foreground"
                  >
                    No posts found. Create your first post!
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {post.coverImage ? (
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            width={60}
                            height={60}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="w-[60px] h-[60px] bg-muted rounded flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">
                              No Image
                            </span>
                          </div>
                        )}
                        <div className="max-w-xs">
                          <Link
                            href={`/admin/blog/edit/${post.id}`}
                            className="font-medium hover:underline line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {post.excerpt || "No excerpt"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {post.category ? (
                        <Badge variant="outline">{post.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {post.published ? (
                        <Badge className="gap-1 bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Published
                        </Badge>
                      ) : (
                        <Badge className="gap-1 bg-orange-500/10 text-orange-700 hover:bg-orange-500/20 dark:text-orange-400">
                          <XCircle className="h-3 w-3" />
                          Draft
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-sm">
                        {post.author.name || "Unknown"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/blogs/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" title="View Post">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/blog/edit/${post.id}`}>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleTogglePublish(post.id, post.published)
                              }
                            >
                              {post.published ? (
                                <>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(post.id)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(post.id, post.title)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredPosts.length)} of{" "}
              {filteredPosts.length} posts
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
