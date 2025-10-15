import { LucideIcon } from "lucide-react";

export interface Category {
  icon: LucideIcon;
  title: string;
  description: string;
  posts: string;
  color: {
    light: string;
    dark: string;
  };
}

export interface CategoriesSectionProps {
  className?: string;
}
