// app/(frontend)/blogs/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, ArrowLeft, Tag, Share2 } from "lucide-react";
import { TableOfContents } from "@/components/posts/TableOfContents";
import { CommentsSection } from "@/components/posts/CommentsSection";
import { LikeSaveShare } from "@/components/posts/LikeSaveShare";
import { ReadingProgressBar } from "@/components/posts/ReadingProgressBar";
import { PrintDownload } from "@/components/posts/PrintDownload";
import { Newsletter } from "@/components/posts/Newsletter";
import { ShareButtons } from "@/components/posts/ShareButtons";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts/public/${slug}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      console.error(`Failed to fetch post "${slug}":`, res.status);
      return null;
    }
    const post = await res.json();
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

async function getRelatedPosts(
  currentPostId: number,
  category: string | null,
  limit = 3
) {
  if (!category) return [];
  try {
    const posts = await prisma.post.findMany({
      where: {
        id: { not: currentPostId },
        category,
        published: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

async function getFeaturedPosts(limit = 4) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        category: true,
        createdAt: true,
      },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const post = await getPost(params.slug);
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }
  return {
    title: `${post.title} - Dubai Estate Blog`,
    description: post.excerpt || `Read ${post.title} on Dubai Estate`,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  if (!post.published) notFound();

  const [relatedPosts, featuredPosts] = await Promise.all([
    getRelatedPosts(post.id, post.category),
    getFeaturedPosts(4),
  ]);

  const readingTime = Math.ceil(post.content.split(" ").length / 200);

  // Extract headings for TOC
  const headingRegex = /<h([2-3]) id="([^"]+)">(.+?)<\/h[2-3]>/g;
  const headings: Array<{ id: string; text: string; level: number }> = [
    {
      id: "9",
      text: "Hello World",
      level: 0,
    },
  ];
  let match;
  while ((match = headingRegex.exec(post.content))) {
    headings.push({ id: match[2], text: match[3], level: Number(match[1]) });
  }

  return (
    <>
      <ReadingProgressBar />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/blogs">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Blog
                </Button>
              </Link>
              <Link href="/" className="font-bold text-lg">
                Dubai Estate
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <main className="lg:col-span-8 order-2 lg:order-1">
              {/* Article Header */}
              <article>
                {/* Category */}
                {post.category && (
                  <Badge className="mb-4" variant="secondary">
                    {post.category}
                  </Badge>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    {post.author.image ? (
                      <img
                        src={post.author.image}
                        alt={post.author.name || "Author"}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <span className="font-medium">
                      {post.author.name || "Anonymous"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={new Date(post.createdAt).toISOString()}>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mb-8">
                  <LikeSaveShare postId={post.id} />
                </div>

                {/* Cover Image */}
                {post.coverImage && (
                  <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-auto object-cover max-h-[500px]"
                    />
                  </div>
                )}

                {/* Content */}
                <div
                  className="prose prose-lg dark:prose-invert max-w-none mb-12 prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-4 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:bg-muted prose-pre:border"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mb-10 pb-10 border-b">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Tags:
                      </span>
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Section */}
                <div className="mb-10 pb-10 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Share this article
                    </h3>
                    <ShareButtons
                      url={`${process.env.NEXT_PUBLIC_APP_URL || ""}/blogs/${
                        post.slug
                      }`}
                      title={post.title}
                    />
                  </div>
                </div>

                {/* Author Card */}
                <div className="bg-muted/50 rounded-xl p-6 mb-12 border">
                  <div className="flex items-start gap-4">
                    {post.author.image ? (
                      <img
                        src={post.author.image}
                        alt={post.author.name || "Author"}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {post.author.name || "Anonymous Author"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Content Writer at Dubai Estate
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Passionate about Dubai real estate and helping people
                        find their dream properties.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                      Related Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {relatedPosts.map((relatedPost) => (
                        <Link
                          key={relatedPost.id}
                          href={`/blogs/${relatedPost.slug}`}
                          className="group"
                        >
                          <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-card">
                            {relatedPost.coverImage ? (
                              <div className="relative h-40 overflow-hidden">
                                <img
                                  src={relatedPost.coverImage}
                                  alt={relatedPost.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-40 bg-muted flex items-center justify-center">
                                <span className="text-muted-foreground text-sm">
                                  No Image
                                </span>
                              </div>
                            )}
                            <div className="p-4">
                              {relatedPost.category && (
                                <Badge
                                  variant="secondary"
                                  className="mb-2 text-xs"
                                >
                                  {relatedPost.category}
                                </Badge>
                              )}
                              <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {relatedPost.title}
                              </h3>
                              {relatedPost.excerpt && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                  {relatedPost.excerpt}
                                </p>
                              )}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <time>
                                  {new Date(
                                    relatedPost.createdAt
                                  ).toLocaleDateString()}
                                </time>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newsletter */}
                <Newsletter />

                {/* Comments */}
                <CommentsSection />
              </article>
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-4 order-1 lg:order-2">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Table of Contents */}
                {headings.length > 0 && (
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Table of Contents
                    </h3>
                    <TableOfContents headings={headings} />
                  </div>
                )}

                {/* Actions */}
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Actions</h3>
                  <PrintDownload />
                </div>

                {/* Featured Posts */}
                {featuredPosts.length > 0 && (
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Popular Articles
                    </h3>
                    <div className="space-y-4">
                      {featuredPosts.map((featured, index) => (
                        <Link
                          key={featured.id}
                          href={`/blogs/${featured.slug}`}
                          className="group block"
                        >
                          <div className="flex gap-3">
                            {featured.coverImage ? (
                              <img
                                src={featured.coverImage}
                                alt={featured.title}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-muted-foreground">
                                  {index + 1}
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                                {featured.title}
                              </h4>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <time>
                                  {new Date(
                                    featured.createdAt
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </time>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Categories</h3>
                  <div className="space-y-2">
                    {[
                      "Buying Guide",
                      "Market Trends",
                      "Investment",
                      "Tips",
                    ].map((cat) => (
                      <Link
                        key={cat}
                        href={`/blogs?category=${cat}`}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t bg-muted/30 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                © {new Date().getFullYear()} Dubai Estate. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
