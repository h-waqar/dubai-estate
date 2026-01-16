"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PricingPlan } from "@/generated/prisma";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { activateSubscription } from "@/modules/user/actions/activateSubscription";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PayPalSubscriptionModalProps {
  plan: PricingPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

const PAYPAL_PLAN_IDS: Record<string, string | undefined> = {
  gold: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD,
  silver: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER,
};

export function PayPalSubscriptionModal({ plan, isOpen, onClose }: PayPalSubscriptionModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!plan) return null;

  // Map Plan Slug to PayPal Plan ID, preferring DB value
  const paypalPlanId = plan.paypalPlanId || PAYPAL_PLAN_IDS[plan.slug] || process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER;

  const handleSuccess = async (data: any) => {
    setLoading(true);
    try {
      const result = await activateSubscription(data.subscriptionID);
      if (result.success) {
        toast.success(`Successfully subscribed to ${result.plan}!`);
        onClose();
        router.push("/account");
      } else {
        toast.error("Subscription activation failed: " + result.error);
      }
    } catch (e) {
      toast.error("An error occurred during activation.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to {plan.name}</DialogTitle>
          <DialogDescription>
            Complete your subscription securely with PayPal.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
            <span className="font-medium">Total</span>
            <span className="text-2xl font-bold">${Number(plan.priceMonthly)}<span className="text-sm text-muted-foreground font-normal">/mo</span></span>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {!paypalPlanId ? (
                 <div className="text-center text-red-500 py-4">
                    Configuration Error: PayPal Plan ID missing.
                 </div>
              ) : (
                <div className="w-full relative z-0">
                  <PayPalButtons
                    className="w-full"
                    style={{ layout: "vertical", shape: "rect", label: "subscribe", height: 40 }}
                    createSubscription={(data, actions) => {
                      return actions.subscription.create({
                        plan_id: paypalPlanId,
                        application_context: {
                          brand_name: "DubaiEstateGuide",
                          user_action: "SUBSCRIBE_NOW",
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
