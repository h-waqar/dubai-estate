import { prisma } from "@/lib/prisma";
import FeaturedArticles, { Article } from "./FeaturedArticles";
import { format } from "date-fns";

export async function FeaturedArticlesSection() {
    // 1. Fetch Latest Posts
    const posts = await prisma.post.findMany({
        where: {
            published: true,
        },
        take: 4,
        orderBy: {
            publishedAt: "desc",
        },
        include: {
            category: {
                select: {
                    name: true,
                }
            }
        }
    });

    if (posts.length === 0) return null;

    // 2. Transform to UI props
    const articles: Article[] = posts.map((post) => {
        // Calculate read time (rough estimate: 200 words per minute)
        const wordCount = post.content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200) + " min read";

        // Fallback description: Strip HTML tags and truncate
        const fallbackDescription = post.content
            .replace(/<[^>]*>/g, "") // Strip HTML tags
            .replace(/\s+/g, " ") // Normalize whitespace
            .trim()
            .substring(0, 150) + "...";

        return {
            image: post.coverImage || "/assets/blog-placeholder.jpg",
            alt: post.title,
            category: post.category?.name || "General",
            date: post.publishedAt ? format(new Date(post.publishedAt), "MMMM d, yyyy") : "",
            readTime: readTime,
            title: post.title,
            description: post.excerpt || fallbackDescription,
            slug: `blogs/${post.slug}`,
        };
    });

    return <FeaturedArticles articles={articles} />;
}
