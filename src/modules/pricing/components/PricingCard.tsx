"use client";

import { PricingPlan } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { activateSubscription } from "@/modules/user/actions/activateSubscription";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginModal } from "@/modules/user/components/LoginModal";

interface PricingCardProps {
  plan: PricingPlan;
  userId?: number | string | null;
}

const PAYPAL_PLAN_IDS: Record<string, string | undefined> = {
  gold: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD,
  silver: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER,
  // Fallback for other plans if needed, or user must add them here
};

export default function PricingCard({ plan, userId }: PricingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Map Plan Slug to PayPal Plan ID, preferring DB value
  const paypalPlanId = plan.paypalPlanId || PAYPAL_PLAN_IDS[plan.slug] || process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER; 

  const handleSuccess = async (data: any) => {
    setLoading(true);
    try {
      const result = await activateSubscription(data.subscriptionID);
      if (result.success) {
        toast.success(`Successfully subscribed to ${result.plan}!`);
        router.push("/account");
      } else {
        toast.error("Subscription activation failed: " + result.error);
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-6 bg-card border rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
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
        <li className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-500" />
          <span>{plan.maxListings} Listings Quota</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-500" />
          <span>{plan.maxFeaturedListings} Featured Credits</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span>Priority Support</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span>Analytics Dashboard</span>
        </li>
      </ul>

      <div className="mt-auto">
        {!userId ? (
          <Button 
            className="w-full" 
            onClick={() => router.push("/api/auth/signin")} // Or toggle LoginModal
          >
            Login to Subscribe
          </Button>
        ) : (
          <>
            {!paypalPlanId ? (
                <Button disabled className="w-full" variant="outline">Not Configured (Plan ID)</Button>
            ) : (
                <>
                    {loading ? (
                        <Button disabled className="w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </Button>
                    ) : (
                        <div className="relative z-0 w-full">
                             <PayPalButtons
                                className="w-full"
                                style={{ layout: "vertical", shape: "rect", label: "subscribe", height: 40 }}
                                createSubscription={(data, actions) => {
                                    return actions.subscription.create({
                                    plan_id: paypalPlanId,
                                    application_context: {
                                        brand_name: "DubaiEstateGuide",
                                        return_url: `${window.location.origin}/account`,
                                        cancel_url: `${window.location.origin}/pricing`,
                                    }
                                    });
                                }}
                                onApprove={handleSuccess}
                                onError={(err) => {
                                    console.error("PayPal Error:", err);
                                    toast.error("Payment initialization failed. Please try again.");
                                }}
                            />
                        </div>
                    )}
                </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
