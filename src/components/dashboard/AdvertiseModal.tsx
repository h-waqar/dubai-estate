"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Zap, ArrowUp, AlertTriangle, Crown, Loader2 } from "lucide-react";
import { activatePromotionAction, bumpUpPropertyAction, getCooldownStatusAction, getUserEntitlementsAction, createAddonOrderAction, captureAddonOrderAction } from "@/modules/promotions/actions/promotions.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PayPalButtons } from "@paypal/react-paypal-js";

interface AdvertiseModalProps {
  listing: {
    id: number;
    title: string;
    isFeatured: boolean;
    type: "PROPERTY" | "PROJECT";
  };
  userRole: string;
  trigger?: React.ReactNode;
}

export function AdvertiseModal({ listing, userRole, trigger }: AdvertiseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<any>(null);
  const [entitlements, setEntitlements] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const isFree = userRole === "USER";

  useEffect(() => {
    if (isOpen) {
      getCooldownStatusAction(listing.id, listing.type).then(res => {
        if (res.success) setCooldown(res.status);
      });
      getUserEntitlementsAction().then(res => {
        if (res.success) setEntitlements(res.entitlements);
      });
    }
  }, [isOpen, listing.id, listing.type, refreshKey]);

  const handleAction = async (type: "SPOTLIGHT" | "FEATURED" | "BUMP_UP") => {
    setLoading(type);
    try {
      let result;
      if (type === "BUMP_UP") {
        result = await bumpUpPropertyAction(listing.id, listing.type);
      } else {
        result = await activatePromotionAction(listing.id, type as any, listing.type);
      }

      if (result.success) {
        toast.success(`${type.replace("_", " ")} activated successfully!`);
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to activate");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(null);
    }
  };

  const options = [
    {
      id: "SPOTLIGHT",
      title: "Spotlight",
      description: "Get a golden border and prime placement in search results for 7 days.",
      icon: Zap,
      color: "text-amber-500",
      borderColor: "border-amber-200",
      bgColor: "bg-amber-50",
      price: "100",
      disabled: isFree,
    },
    {
      id: "FEATURED",
      title: "Featured",
      description: "Pinned to the top of the category and main search results for 30 days.",
      icon: Crown,
      color: "text-purple-500",
      borderColor: "border-purple-200",
      bgColor: "bg-purple-50",
      price: "50",
      disabled: isFree || listing.isFeatured,
    },
    {
      id: "BUMP_UP",
      title: "Bump Up",
      description: cooldown?.isAvailable 
        ? "Instantly refresh your listing date to move it back to the top of results."
        : `Available in ${cooldown?.remainingHours}h`,
      icon: ArrowUp,
      color: "text-blue-500",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
      price: "10",
      disabled: isFree || (cooldown && !cooldown.isAvailable),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-8 gap-2 border-amber-200 hover:bg-amber-50 text-amber-700">
            <Megaphone className="w-3.5 h-3.5" />
            Advertise
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Advertise {listing.type === "PROPERTY" ? "Property" : "Project"}</DialogTitle>
          <DialogDescription>
            Boost visibility for {listing.title} using your credits or buy a one-time boost.
          </DialogDescription>
        </DialogHeader>

        {isFree && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Pro Feature Only</p>
              <p className="text-xs text-amber-700 mt-1">
                You are currently on the Free tier. Upgrade to a Pro plan to use promotions.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-4 py-4">
          {options.map((option) => {
            const creditsData = entitlements ? entitlements[option.id === "BUMP_UP" ? "BUMP_UP_CREDIT" : (option.id + "_CREDIT")] : null;
            const credits = creditsData ? (creditsData.total - creditsData.used) : 0;
            const canApply = credits > 0;

            return (
              <div
                key={option.id}
                className={cn(
                  "flex flex-col p-4 rounded-xl border transition-all",
                  option.borderColor,
                  option.bgColor,
                  option.disabled && "opacity-60 grayscale cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2 rounded-lg bg-white shadow-sm", option.color)}>
                      <option.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        {option.title}
                        {credits > 0 && (
                          <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-green-100 text-green-700">
                            {credits} Credit{credits > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                    </div>
                  </div>
                  
                  {canApply ? (
                    <Button
                      size="sm"
                      onClick={() => handleAction(option.id as any)}
                      disabled={option.disabled || !!loading}
                      className={cn(
                        "font-bold",
                        option.id === "SPOTLIGHT" && "bg-amber-500 hover:bg-amber-600",
                        option.id === "FEATURED" && "bg-purple-500 hover:bg-purple-600",
                        option.id === "BUMP_UP" && "bg-blue-500 hover:bg-blue-600"
                      )}
                    >
                      {loading === option.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                    </Button>
                  ) : !option.disabled && (
                    <div className="w-[150px]">
                      <PayPalButtons
                        style={{ layout: "horizontal", height: 32, label: "pay", tagline: false }}
                        createOrder={async () => {
                          const res = await createAddonOrderAction(option.id, option.price, 1);
                          if (res.success) return res.orderId;
                          throw new Error(res.error);
                        }}
                        onApprove={async (data) => {
                          const res = await captureAddonOrderAction(data.orderID);
                          if (res.success) {
                            toast.success("Addon purchased! You can now apply it.");
                            setRefreshKey(prev => prev + 1);
                          } else {
                            toast.error(res.error || "Payment failed");
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="sm:justify-start">
          <p className="text-[10px] text-muted-foreground text-center sm:text-left">
            Credits are non-refundable once applied. Promotions are active immediately.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
