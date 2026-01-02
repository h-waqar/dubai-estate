// src/components/sections/FeaturedArticles.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


export interface Article {
  image: string;
  alt: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  description: string;
  slug?: string; // Added optional slug
}

interface ArticleListItemProps {
  article: Article;
}

function ArticleListItem({ article }: ArticleListItemProps) {
  return (
    <Card className="group overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="flex">
        <div className="w-32 shrink-0 relative overflow-hidden bg-gray-200 dark:bg-gray-800">
          <Image
            src={article.image}
            alt={article.alt}
            fill
            sizes="256px"
            quality={90}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge
              variant="secondary"
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/30"
            >
              {article.category}
            </Badge>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {article.readTime}
            </div>
          </div>
          <h4 className="font-bold mb-2 text-sm leading-tight line-clamp-2 text-gray-900 dark:text-white transition-colors group-hover:text-yellow-500 dark:group-hover:text-yellow-400">
            {article.title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {article.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {article.date}
            </span>
            <Link href={`/${article.slug}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs hover:text-yellow-500 dark:hover:text-yellow-400 transition-transform group-hover:translate-x-1"
              >
                Read More →
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default function FeaturedArticles({ articles }: { articles: Article[] }) {
  const featured = articles[0];
  const list = articles.slice(1, 4);

  if (!featured) return null; // Handle empty state

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Featured Articles
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stay informed with expert insights, market analysis, and
            comprehensive guides from Dubai&apos;s leading real estate
            professionals
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Featured Article */}
          <Link href={`/${featured.slug}`} className="block lg:row-span-2">
            <Card className="h-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="relative h-64 lg:h-80 bg-gray-200 dark:bg-gray-800">
                <Image
                  src={featured.image}
                  alt={featured.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                  priority
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                  Featured
                </Badge>
                <Badge
                  variant="secondary"
                  className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
                >
                  {featured.category}
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  {featured.date}
                  <Clock className="w-4 h-4 ml-4 mr-2" />
                  {featured.readTime}
                </div>
                <h3 className="text-2xl font-bold mb-4 leading-tight text-gray-900 dark:text-white">
                  {featured.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {featured.description}
                </p>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Article List */}
          <div className="space-y-6">
            {list.map((article, index) => (
              <ArticleListItem key={index} article={article} />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/blogs">
            <Button
              variant="outline"
              size="lg"
              className="px-8 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
