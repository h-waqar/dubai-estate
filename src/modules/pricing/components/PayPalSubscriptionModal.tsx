"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PricingPlan } from "@prisma/client";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { activateSubscription } from "@/modules/user/actions/activateSubscription";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCouponStore } from "@/stores/useCouponStore";
import { validateCouponAction } from "@/actions/coupon";

interface PayPalSubscriptionModalProps {
  plan: PricingPlan | null;
  isOpen: boolean;
  onClose: () => void;
  userId?: number | string | null;
}

const PAYPAL_PLAN_IDS: Record<string, string | undefined> = {
  gold: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD,
  silver: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER,
};

export function PayPalSubscriptionModal({ plan, isOpen, onClose, userId }: PayPalSubscriptionModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { code, setCode, appliedCoupon, setAppliedCoupon, discountValue, setDiscount, clearCoupon } = useCouponStore();
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (!isOpen) {
        clearCoupon();
    }
  }, [isOpen, clearCoupon]);

  useEffect(() => {
    if (plan && appliedCoupon) {
        let discount = 0;
        const price = Number(plan.priceMonthly);
        if (appliedCoupon.type === 'PERCENTAGE') {
            discount = price * (appliedCoupon.value / 100);
        } else if (appliedCoupon.type === 'FIXED') {
            discount = appliedCoupon.value;
        }
        if (discount > price) discount = price;
        setDiscount(discount);
    }
  }, [plan, appliedCoupon, setDiscount]);

  const handleApplyCoupon = async () => {
      if (!code) return;
      if (!plan) return;
      setValidating(true);
      const res = await validateCouponAction(code, plan.id);
      setValidating(false);

      if (res.success && res.coupon) {
          setAppliedCoupon({
              id: res.coupon.id,
              code: res.coupon.code,
              type: res.coupon.type as any,
              value: Number(res.coupon.value)
          });
          toast.success("Coupon applied!");
      } else {
          toast.error(res.error || "Invalid coupon");
          clearCoupon();
          setCode(code);
      }
  };

  if (!plan) return null;

  const paypalPlanId = plan.paypalPlanId || PAYPAL_PLAN_IDS[plan.slug] || process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER;
  const originalPrice = Number(plan.priceMonthly);
  const finalPrice = Math.max(0, originalPrice - discountValue);

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
          <div className="flex flex-col p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">${originalPrice.toFixed(2)}/mo</span>
            </div>
            {appliedCoupon && (
                <div className="flex justify-between items-center text-green-600">
                    <span className="font-medium text-sm flex items-center"><Tag className="w-3 h-3 mr-1"/> Coupon ({appliedCoupon.code})</span>
                    <span className="font-semibold text-sm">-${discountValue.toFixed(2)}</span>
                </div>
            )}
             <div className="flex justify-between items-center pt-2 border-t mt-2">
                <span className="font-bold text-lg">Total</span>
                <span className="text-2xl font-bold">${finalPrice.toFixed(2)}<span className="text-sm text-muted-foreground font-normal">/mo</span></span>
            </div>
          </div>

          <div className="flex gap-2">
              <Input 
                placeholder="Discount code" 
                value={code} 
                onChange={(e) => setCode(e.target.value)}
                disabled={!!appliedCoupon}
              />
              {appliedCoupon ? (
                  <Button variant="outline" onClick={clearCoupon}>Remove</Button>
              ) : (
                  <Button onClick={handleApplyCoupon} disabled={!code || validating}>
                      {validating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                  </Button>
              )}
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
                      const createOptions: any = {
                        plan_id: paypalPlanId,
                        application_context: {
                          brand_name: "DubaiEstateGuide",
                          user_action: "SUBSCRIBE_NOW",
                          return_url: `${window.location.origin}/account`,
                          cancel_url: `${window.location.origin}/pricing`,
                        },
                        custom_id: JSON.stringify({
                             userId: userId, 
                             couponCode: appliedCoupon?.code 
                        })
                      };
                      
                      if (appliedCoupon && discountValue > 0) {
                          createOptions.plan = {
                              billing_cycles: [
                                  {
                                      sequence: 1,
                                      total_cycles: 0, 
                                      pricing_scheme: {
                                          fixed_price: {
                                              value: finalPrice.toFixed(2),
                                              currency_code: "USD"
                                          }
                                      }
                                  }
                              ]
                          };
                      }

                      return actions.subscription.create(createOptions);
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
