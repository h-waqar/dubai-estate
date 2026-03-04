import { LucideIcon } from "lucide-react";

export interface PricingPlan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  priceMonthly: any; // Decimal
  priceYearly: any; // Decimal
  priceOneTime?: any; // Decimal
  type?: any; // PlanType
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  entitlements?: any[];
  _count?: {
    users: number;
  };
}

