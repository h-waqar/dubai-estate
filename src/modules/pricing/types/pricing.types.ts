import { LucideIcon } from "lucide-react";

export interface PricingPlan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  maxListings: number;
  priceMonthly: any; // Decimal
  priceYearly: any; // Decimal
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    users: number;
  };
}
