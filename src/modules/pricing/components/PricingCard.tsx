"use client";

import { PricingPlan, PlanEntitlement, EntitlementDefinition, Subscription } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export type PricingPlanWithEntitlements = PricingPlan & { 
  entitlements?: (PlanEntitlement & { definition: EntitlementDefinition })[] 
};

interface PricingCardProps {
  plan: PricingPlanWithEntitlements;
  userId?: number | string | null;
  onSubscribe: (plan: PricingPlan) => void;
  activeSubscription?: (Subscription & { plan: PricingPlan }) | null;
}

export default function PricingCard({ plan, userId, onSubscribe, activeSubscription }: PricingCardProps) {
  const router = useRouter();

  const visibleEntitlements = plan.entitlements?.filter(e => e.amount > 0) || [];

  const isCurrentPlan = activeSubscription?.planId === plan.id;
  const isUpgrade = activeSubscription && plan.rank > activeSubscription.plan.rank;

  let buttonText = "Subscribe";
  if (isCurrentPlan) buttonText = "Current Plan";
  else if (isUpgrade) buttonText = `Upgrade to ${plan.name}`;

  return (
    <div className="flex flex-col p-6 bg-card border rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden h-full">
        {plan.slug === "gold" && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
            </div>
        )}
      
      <div className="space-y-2 mb-6">
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <p className="text-muted-foreground min-h-[40px]">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">${Number(plan.priceMonthly)}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {visibleEntitlements.map((ent) => (
          <li key={ent.id} className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span>{ent.amount} {ent.definition.name}</span>
          </li>
        ))}
        <li className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span>Priority Support</span>
        </li>
      </ul>

      <div className="mt-auto">
        {!userId ? (
          <Button 
            className="w-full" 
            onClick={() => router.push("/api/auth/signin")}
          >
            Login to Subscribe
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={() => !isCurrentPlan && onSubscribe(plan)}
            variant={isCurrentPlan ? "secondary" : (plan.slug === "gold" ? "default" : "outline")}
            disabled={isCurrentPlan}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
