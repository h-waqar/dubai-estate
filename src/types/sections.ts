// src/types/sections.ts
import { LucideIcon } from "lucide-react";

// Categories Types
export interface Category {
  icon: LucideIcon;
  title: string;
  description: string;
  posts: string;
  colorClass: string;
}

export interface CategoriesSectionProps {
  className?: string;
}

// Featured Properties Types
export interface Property {
  id: number;
  image: string;
  alt: string;
  featured: boolean;
  type: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
}

export interface PropertyCardProps {
  property: Property;
}

// Featured Articles Types
export interface Article {
  image: string;
  alt: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  description: string;
}

export interface ArticleListItemProps {
  article: Article;
}

export interface FeaturedArticlesData {
  featured: Article;
  list: Article[];
}

// Newsletter Types
export interface NewsletterFormData {
  email: string;
}

export interface StatProps {
  number: string;
  label: string;
}
