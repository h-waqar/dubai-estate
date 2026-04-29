"use client";

import { PricingPlan } from "@prisma/client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import PayPalCheckoutModal from "./PayPalCheckoutModal";

interface PricingListProps {
  plans: (PricingPlan & {
    entitlements: { amount: number; definition: { name: string; code: string } }[];
  })[];
  currentPlanId?: number | null;
  userId?: number | string | null;
}

export function PricingList({ plans, currentPlanId, userId }: PricingListProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`relative flex flex-col ${plan.id === currentPlanId ? 'border-primary shadow-md' : ''}`}
        >
          {plan.id === currentPlanId && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">Current Plan</Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-4">
              <span className="text-4xl font-bold">${Number(plan.priceMonthly)}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2">
              {plan.entitlements.map((entitlement) => (
                <li key={entitlement.definition.code} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    {entitlement.amount} {entitlement.definition.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant={plan.id === currentPlanId ? "outline" : "default"}
              disabled={plan.id === currentPlanId}
              onClick={() => handleSelectPlan(plan)}
            >
              {plan.id === currentPlanId ? "Active" : "Select Plan"}
            </Button>
          </CardFooter>
        </Card>
      ))}

      <PayPalCheckoutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
        userId={userId}
        mode="SUBSCRIPTION"
      />
    </div>
  );
}
