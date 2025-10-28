// src/app/blogs/page.tsx
import Link from "next/link";
import BlogsClient from "@/modules/blog/components/BlogsClient";
import { Metadata } from "next";
import { getPublishedPosts } from "@/modules/blog/services/post.service";
import { getAllCategories } from "@/modules/blog/services/category.service";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog - Dubai Estate",
  description: "Read the latest articles and guides about Dubai real estate",
};

export default async function BlogsPage() {
  const posts = await getPublishedPosts();
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      <Header />

      {/* <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Dubai Estate
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link href="/blogs" className="text-sm font-medium">
                Blog
              </Link>
              <Link
                href="/properties"
                className="text-sm hover:text-primary transition-colors"
              >
                Properties
              </Link>
            </nav>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      {/* <section className="bg-gradient-to-b from-muted/50 to-background py-16 border-b overflow-hidden">
        <Image
          src={"/assets/dubai-hero.jpg"}
          alt="Dubai Estate Blog"
          fill
          className="max-h-full object-cover"
        />

        <div className="container mx-auto px-4 text-center max-w-3xl z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Dubai Estate Blog
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover insights, guides, and the latest news about Dubai real
            estate market
          </p>
        </div>
      </section> */}

      <section className="relative bg-gradient-to-b from-muted/50 to-background py-16 border-b overflow-hidden">
        <Image
          src={"/assets/dubai-hero.jpg"}
          alt="Dubai Estate Blog"
          fill
          className="object-cover "
        />

        {/* Make this container relative so its z-index applies correctly */}
        <div className="relative container mx-auto px-4 text-center max-w-3xl z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Dubai Estate Blog
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover insights, guides, and the latest news about Dubai real
            estate market
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">No posts yet</h2>
            <p className="text-muted-foreground mb-6">
              Check back soon for new content!
            </p>

            {/* Helpful message */}
            <div className="mt-8 p-6 bg-muted rounded-lg max-w-md mx-auto text-left">
              <h3 className="font-semibold mb-3">
                🔧 No published posts found
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Make sure you have posts with{" "}
                <code className="bg-background px-1 rounded">
                  published = true
                </code>
              </p>
              <p className="text-sm text-muted-foreground">
                Go to{" "}
                <Link href="/admin/blog" className="text-primary underline">
                  /admin/blog
                </Link>{" "}
                to publish posts
              </p>
            </div>
          </div>
        ) : (
          <BlogsClient initialPosts={posts} categories={categories} />
        )}
      </div>

      {/* Footer */}
      {/* <footer className="border-t bg-muted/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Dubai Estate. All rights reserved.</p>
        </div>
      </footer> */}

      <Footer />
    </div>
  );
}
