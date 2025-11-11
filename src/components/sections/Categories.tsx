"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building,
  TrendingUp,
  MapPin,
  FileText,
  Crown,
  Newspaper,
  Users,
  Home,
  LucideIcon,
} from "lucide-react";

interface Category {
  icon: LucideIcon;
  title: string;
  description: string;
  posts: string;
  colorClass: string;
  href: string;
}

const categories: Category[] = [
  {
    icon: Building,
    title: "Property Listings",
    description: "Dubai apartments, villas, and commercial properties",
    posts: "120+",
    colorClass: "text-blue-600 dark:text-blue-400",
    href: "/blog/category/property-listings",
  },
  {
    icon: TrendingUp,
    title: "Investment & Market Insights",
    description: "Trends, ROI analysis, and price comparisons",
    posts: "85+",
    colorClass: "text-green-600 dark:text-green-400",
    href: "/blog/category/investment",
  },
  {
    icon: MapPin,
    title: "Neighborhood Guides",
    description: "Dubai Marina, Downtown Dubai, Palm Jumeirah",
    posts: "60+",
    colorClass: "text-red-600 dark:text-red-400",
    href: "/blog/category/neighborhoods",
  },
  {
    icon: FileText,
    title: "Buying & Selling Tips",
    description: "Legal tips, documentation, negotiation strategies",
    posts: "95+",
    colorClass: "text-purple-600 dark:text-purple-400",
    href: "/blog/category/buying-selling",
  },
  {
    icon: Crown,
    title: "Luxury Real Estate",
    description: "High-end villas, penthouses, premium properties",
    posts: "45+",
    colorClass: "text-yellow-600 dark:text-yellow-400",
    href: "/blog/category/luxury",
  },
  {
    icon: Newspaper,
    title: "News & Updates",
    description: "Regulations, upcoming projects, government changes",
    posts: "150+",
    colorClass: "text-indigo-600 dark:text-indigo-400",
    href: "/blog/category/news",
  },
  {
    icon: Users,
    title: "Expat & Lifestyle",
    description: "Living in Dubai, rentals, amenities, lifestyle tips",
    posts: "75+",
    colorClass: "text-pink-600 dark:text-pink-400",
    href: "/blog/category/lifestyle",
  },
  {
    icon: Home,
    title: "Off-Plan Properties",
    description: "Pre-launch projects, investment opportunities",
    posts: "40+",
    colorClass: "text-teal-600 dark:text-teal-400",
    href: "/blog/category/off-plan",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Explore Categories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover comprehensive guides and insights across all aspects of
            Dubai real estate
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link key={index} href={category.href}>
                <Card className="group cursor-pointer h-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent
                          className={`w-7 h-7 ${category.colorClass}`}
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {category.posts} posts
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors duration-300">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
