"use client";

import { PricingPlanWithEntitlements } from "./PricingCard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Zap, ArrowUp, Loader2 } from "lucide-react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { createAddonOrderAction, captureAddonOrderAction } from "@/actions/promotions.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddonPurchaseListProps {
  plans: PricingPlanWithEntitlements[];
  userId: number | string;
}

export function AddonPurchaseList({ plans, userId }: AddonPurchaseListProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const initialPayPalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "capture",
  };

  const getIcon = (slug: string) => {
    if (slug.includes('featured')) return Star;
    if (slug.includes('spotlight')) return Zap;
    if (slug.includes('bump')) return ArrowUp;
    return Star;
  };

  const getColor = (slug: string) => {
    if (slug.includes('featured')) return "text-purple-500";
    if (slug.includes('spotlight')) return "text-amber-500";
    if (slug.includes('bump')) return "text-blue-500";
    return "text-primary";
  };

  return (
    <PayPalScriptProvider options={initialPayPalOptions}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = getIcon(plan.slug);
          const color = getColor(plan.slug);
          const price = plan.priceOneTime || "0";

          return (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-muted ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-3xl font-bold">${Number(price)}</div>
                <p className="text-xs text-muted-foreground mt-1">One-time payment</p>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <PayPalButtons
                    style={{ layout: "horizontal", height: 38, label: "pay", tagline: false }}
                    createOrder={async () => {
                      // Map slug to addonType for the action
                      let type = "featured";
                      if (plan.slug.includes("spotlight")) type = "spotlight";
                      if (plan.slug.includes("bump")) type = "bump_up";
                      
                      const res = await createAddonOrderAction(type, price.toString());
                      if (res.success) return res.orderId;
                      toast.error(res.error || "Failed to create order");
                      throw new Error(res.error);
                    }}
                    onApprove={async (data) => {
                      setLoadingId(plan.id);
                      const res = await captureAddonOrderAction(data.orderID);
                      if (res.success) {
                        toast.success("Purchase successful! Credits added to your account.");
                        router.refresh();
                      } else {
                        toast.error(res.error || "Payment failed");
                      }
                      setLoadingId(null);
                    }}
                  />
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </PayPalScriptProvider>
  );
}
