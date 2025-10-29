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

// A specific type for status to prevent typos
export type PropertyStatus = "Offplan" | "Ready";

// The single source of truth for our Property type
export interface Property {
  id: number;
  image: string;
  alt: string; // Kept for accessibility
  title: string;
  location: string;
  price: string;
  bedrooms: number; // Standardized from 'beds'
  bathrooms: number; // Standardized from 'baths'
  area: string; // Standardized from 'size'
  type: string;
  featured: boolean;
  ref: string; // Added from PropertyCard.tsx
  status?: PropertyStatus; // Added from PropertyCard.tsx with the specific type
}

// This can also be in the central file
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
