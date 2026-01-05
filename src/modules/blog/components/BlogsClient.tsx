"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, ArrowRight, Search, Loader2 } from "lucide-react";
import Image from "next/image";
import { PostWithRelations } from "@/modules/blog/types/post.types";
import { fetchPosts } from "@/app/(frontend)/blogs/actions";
import { useDebounce } from "@/hooks/use-debounce";

interface BlogsClientProps {
  initialPosts: PostWithRelations[];
  initialTotal: number;
  categories: { id: number; name: string }[];
}

export default function BlogsClient({
  initialPosts,
  initialTotal,
  categories,
}: BlogsClientProps) {
  const [posts, setPosts] = useState<PostWithRelations[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch posts when filters change (search or category)
  useEffect(() => {
    // Skip initial load
    if (page === 1 && searchQuery === "" && selectedCategory === "all" && posts === initialPosts) return;

    const loadPosts = async () => {
      setLoading(true);
      try {
        const result = await fetchPosts({
          category: selectedCategory,
          search: debouncedSearch,
          page: 1, // Reset to page 1 on filter change
          limit: 3, // Using 3 for testing as requested
        });
        setPosts(result.data);
        setTotal(result.total);
        setPage(1);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory]);

  const loadMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const result = await fetchPosts({
        category: selectedCategory,
        search: debouncedSearch,
        page: nextPage,
        limit: 3,
      });

      setPosts((prev) => [...prev, ...result.data]);
      setPage(nextPage);
      setTotal(result.total);
    } catch (error) {
      console.error("Failed to load more posts", error);
    } finally {
      setLoading(false);
    }
  };

  const hasMore = posts.length < total;

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {loading && page === 1 ? (
            <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading...
            </div>
        ) : (
            posts.length === total
            ? `${posts.length} article${posts.length !== 1 ? "s" : ""}`
            : `${posts.length} of ${total} articles`
        )}
      </div>

      {/* Posts Grid */}
      {posts.length === 0 && !loading ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link key={post.id} href={`/blogs/${post.slug}`} className="group h-full flex flex-col">
              <article className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden bg-muted flex-shrink-0">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      priority={index < 6}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground">No Image</span>
                    </div>
                  )}
                  {post.category && (
                    <Badge
                      className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
                      variant="secondary"
                    >
                      {post.category.name}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Title */}
                  <h2 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt ||
                      post.content
                        .replace(/<[^>]*>/g, "")
                        .replace(/\s+/g, " ")
                        .trim()
                        .substring(0, 150) + "..."}
                  </p>

                  {/* Spacer to push bottom content down */}
                  <div className="mt-auto">
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={new Date(post.createdAt).toISOString()}>
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>5 min read</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Read More */}
                    <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      Read more
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
      
      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="px-8 min-w-[200px]"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Articles"
            )}
          </Button>
          <div className="mt-2 text-sm text-muted-foreground">
            Showing {posts.length} of {total} articles
          </div>
        </div>
      )}
    </div>
  );
}