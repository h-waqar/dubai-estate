// src/components/sections/FeaturedArticles.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Article {
  image: string;
  alt: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  description: string;
}

interface ArticleListItemProps {
  article: Article;
}

const articles: {
  featured: Article;
  list: Article[];
} = {
  featured: {
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    alt: "Dubai Real Estate Market Outlook 2024",
    category: "Market Insights",
    date: "March 15, 2024",
    readTime: "8 min read",
    title:
      "Dubai Real Estate Market Outlook 2024: Key Trends and Investment Opportunities",
    description:
      "Comprehensive analysis of Dubai's property market performance and future projections for savvy investors.",
  },
  list: [
    {
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop",
      alt: "Complete Guide to Buying Property in Dubai Marina",
      category: "Buying Guide",
      date: "March 12, 2024",
      readTime: "6 min read",
      title: "Complete Guide to Buying Property in Dubai Marina",
      description:
        "Everything you need to know about purchasing real estate in one of Dubai's most popular waterfront communities.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop",
      alt: "Top 10 Luxury Developments Launching in 2024",
      category: "Luxury Real Estate",
      date: "March 10, 2024",
      readTime: "5 min read",
      title: "Top 10 Luxury Developments Launching in 2024",
      description:
        "Exclusive preview of the most anticipated luxury residential projects coming to Dubai this year.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      alt: "Investment ROI Analysis: Dubai vs Global Cities",
      category: "Investment",
      date: "March 8, 2024",
      readTime: "10 min read",
      title: "Investment ROI Analysis: Dubai vs Global Cities",
      description:
        "Detailed comparison of real estate returns in Dubai against major international property markets.",
    },
  ],
};

function ArticleListItem({ article }: ArticleListItemProps) {
  return (
    <Card className="group overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="flex">
        <div className="w-32 flex-shrink-0 relative overflow-hidden">
          <Image
            src={article.image}
            alt={article.alt}
            width={128}
            height={160}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs hover:text-yellow-500 dark:hover:text-yellow-400 transition-transform group-hover:translate-x-1"
            >
              Read More →
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default function FeaturedArticles() {
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
          <Card className="lg:row-span-2 overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="relative h-64 lg:h-80">
              <Image
                src={articles.featured.image}
                alt={articles.featured.alt}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                Featured
              </Badge>
              <Badge
                variant="secondary"
                className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
              >
                {articles.featured.category}
              </Badge>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                {articles.featured.date}
                <Clock className="w-4 h-4 ml-4 mr-2" />
                {articles.featured.readTime}
              </div>
              <h3 className="text-2xl font-bold mb-4 leading-tight text-gray-900 dark:text-white">
                {articles.featured.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {articles.featured.description}
              </p>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white">
                Read Article
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Article List */}
          <div className="space-y-6">
            {articles.list.map((article, index) => (
              <ArticleListItem key={index} article={article} />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/blog">
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
