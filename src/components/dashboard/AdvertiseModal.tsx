"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Zap, ArrowUp, CheckCircle2, AlertTriangle, Crown } from "lucide-react";
import { activatePromotionAction, bumpUpPropertyAction } from "@/actions/promotions.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AdvertiseModalProps {
  property: {
    id: number;
    title: string;
    isFeatured: boolean;
  };
  userRole: string;
  trigger?: React.ReactNode;
}

export function AdvertiseModal({ property, userRole, trigger }: AdvertiseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const isFree = userRole === "USER"; // Simplification for now

  const handleAction = async (type: "SPOTLIGHT" | "FEATURED" | "BUMP_UP") => {
    setLoading(type);
    try {
      let result;
      if (type === "BUMP_UP") {
        result = await bumpUpPropertyAction(property.id);
      } else {
        result = await activatePromotionAction(property.id, type);
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
      disabled: isFree || property.isFeatured,
    },
    {
      id: "BUMP_UP",
      title: "Bump Up",
      description: "Instantly refresh your listing date to move it back to the top of results.",
      icon: ArrowUp,
      color: "text-blue-500",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
      disabled: isFree,
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
          <DialogTitle>Advertise Property</DialogTitle>
          <DialogDescription>
            Boost visibility for {property.title} using your account credits.
          </DialogDescription>
        </DialogHeader>

        {isFree && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Pro Feature Only</p>
              <p className="text-xs text-amber-700 mt-1">
                You are currently on the Free tier. Upgrade to a Pro plan to use property promotions.
              </p>
              <Button variant="link" size="sm" className="h-auto p-0 text-amber-800 underline mt-1 font-bold">
                View Pricing Plans
              </Button>
            </div>
          </div>
        )}

        <div className="grid gap-4 py-4">
          {options.map((option) => (
            <div
              key={option.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all",
                option.borderColor,
                option.bgColor,
                option.disabled && "opacity-60 grayscale cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("p-2 rounded-lg bg-white shadow-sm", option.color)}>
                  <option.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {option.title}
                    {option.id === "FEATURED" && property.isFeatured && (
                      <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[300px]">
                    {option.description}
                  </p>
                </div>
              </div>
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
                {loading === option.id ? "Activating..." : "Apply"}
              </Button>
            </div>
          ))}
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
