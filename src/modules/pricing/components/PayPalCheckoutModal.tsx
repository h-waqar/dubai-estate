"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PricingPlan } from "@prisma/client";
import { usePayPalScriptReducer, PayPalButtons, DISPATCH_ACTION } from "@paypal/react-paypal-js";
import { activateSubscription } from "@/modules/user/actions/activateSubscription";
import { captureAddonOrderAction, createAddonOrderAction } from "@/modules/promotions/actions/promotions.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Loader2, Tag, ShoppingCart, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCouponStore } from "@/stores/useCouponStore";
import { validateCouponAction } from "@/actions/coupon";

interface PayPalCheckoutModalProps {
  plan: PricingPlan | null;
  qty?: number;
  isOpen: boolean;
  onClose: () => void;
  mode: "SUBSCRIPTION" | "ADDON";
  userId?: number | string | null;
}

export default function PayPalCheckoutModal({ plan, qty = 1, isOpen, onClose, mode, userId }: PayPalCheckoutModalProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const { appliedCoupon: coupon, setAppliedCoupon: setCoupon, clearCoupon } = useCouponStore();

  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const prevMode = useRef<"SUBSCRIPTION" | "ADDON" | null>(null);

  useEffect(() => {
    if (isOpen && mode !== prevMode.current) {
        prevMode.current = mode;
        dispatch({
            type: DISPATCH_ACTION.RESET_OPTIONS,
            value: {
                ...options,
                intent: mode === "SUBSCRIPTION" ? "subscription" : "capture",
                // Force vault: true even for capture to ensure branded card button (popup)
                // instead of inline Advanced Card Fields (ACDC).
                vault: true,
            },
        });
    }
  }, [isOpen, mode, dispatch, options]);

  if (!plan) return null;

  // Calculate totals
  const basePrice = mode === "SUBSCRIPTION"
    ? parseFloat(plan.priceMonthly?.toString() || "0")
    : parseFloat(plan.priceOneTime?.toString() || "0");

  const subtotal = basePrice * qty;
  const discount = coupon ? (coupon.type === "PERCENTAGE" ? (subtotal * coupon.value / 100) : coupon.value) : 0;
  const total = Math.max(0, subtotal - discount);

  const handleValidateCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
        const result = await validateCouponAction(couponCode, plan.id);
        if (result.success && result.coupon) {
            setCoupon(result.coupon as any);
            toast.success("Coupon applied!");
        } else {
            toast.error(result.error || "Invalid coupon");
        }
    } catch (e) {
        toast.error("Failed to validate coupon");
    } finally {
        setIsValidatingCoupon(false);
    }
  };

  const handleSubscriptionApprove = async (data: any) => {
    setIsProcessing(true);
    try {
        const result = await activateSubscription(data.subscriptionID);
        if (result.success) {
            toast.success(`Subscription activated! Welcome to ${result.plan} plan.`);
            clearCoupon();
            onClose();
            router.push("/account");
            router.refresh();
        } else {
            toast.error(result.error || "Failed to activate subscription");
        }
    } catch (e) {
        toast.error("An error occurred during activation");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleAddonApprove = async (data: any) => {
    setIsProcessing(true);
    try {
        const result = await captureAddonOrderAction(data.orderID);
        if (result.success) {
            toast.success("Purchase successful! Credits added to your account.");
            clearCoupon();
            onClose();
            router.push("/account");
            router.refresh();
        } else {
            toast.error(result.error || "Failed to complete purchase");
        }
    } catch (e) {
        toast.error("An error occurred during purchase");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Purchase</DialogTitle>
          <DialogDescription>
            {mode === "SUBSCRIPTION" ? `Subscribe to ${plan.name} plan` : `Purchase ${qty}x ${plan.name}`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
            {/* Order Summary */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                    <span>{plan.name} {qty > 1 ? `x ${qty}` : ""}</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                {coupon && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({coupon.code})</span>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Coupon Code */}
            {!coupon ? (
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Coupon Code</label>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Enter code" 
                            value={couponCode} 
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="h-9"
                        />
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={handleValidateCoupon}
                            disabled={isValidatingCoupon || !couponCode}
                        >
                            {isValidatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-100">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                        <Tag className="h-4 w-4" />
                        <span className="font-medium">{coupon.code} applied</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearCoupon} className="h-7 text-green-700 hover:text-green-800 hover:bg-green-100">
                        Remove
                    </Button>
                </div>
            )}

            {/* PayPal Buttons */}
            <div className="relative min-h-[150px]">
                { (isPending || isProcessing) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                <PayPalButtons
                    style={{ 
                        layout: "vertical",
                        shape: "rect",
                        label: mode === "SUBSCRIPTION" ? "subscribe" : "buynow"
                    }}
                    createSubscription={mode === "SUBSCRIPTION" ? (data, actions) => {
                        if (!plan.paypalPlanId) {
                            toast.error("This plan is not configured for PayPal subscriptions.");
                            throw new Error("Missing paypalPlanId");
                        }
                        return actions.subscription.create({
                            plan_id: plan.paypalPlanId,
                            custom_id: JSON.stringify({ 
                                userId: userId ? Number(userId) : undefined,
                                couponCode: coupon?.code
                            })
                        });
                    } : undefined}
                    createOrder={mode === "ADDON" ? async () => {
                        const res = await createAddonOrderAction(plan.slug, plan.priceOneTime?.toString() || "0", qty);
                        if (res.success) return res.orderId;
                        throw new Error(res.error);
                    } : undefined}
                    onApprove={mode === "SUBSCRIPTION" ? handleSubscriptionApprove : handleAddonApprove}
                    onError={(err) => {
                        console.error("PayPal Error:", err);
                        // If it's an INVALID_REQUEST, it might be due to planId/clientId mismatch
                        toast.error("PayPal checkout failed. This usually means the payment plan is not valid for this account.");
                    }}
                />
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest pt-2">
                <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" /> Secure Payment
                </div>
                <div className="flex items-center gap-1">
                    <ShoppingCart className="h-3 w-3" /> Instant Access
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
