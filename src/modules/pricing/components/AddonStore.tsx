"use client";

import { PricingPlan } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { PayPalCheckoutModal } from "./PayPalCheckoutModal";

interface AddonPack {
  qty: number;
  label: string;
  discount: string | number;
  planId?: number | null;
}

interface AddonStoreProps {
  addonPlans: PricingPlan[];
  userId?: number | string | null;
  packs: AddonPack[];
}

const DEFAULT_PACKS = [
  { qty: 1, label: "Single", discount: 0 },
  { qty: 4, label: "Starter Pack", discount: 0.1 },
  { qty: 12, label: "Pro Pack", discount: 0.2 },
  { qty: 24, label: "Business Pack", discount: 0.3 },
];

export default function AddonStore({ addonPlans, userId, packs }: AddonStoreProps) {
  const [selectedPack, setSelectedPack] = useState<{ plan: PricingPlan, pack: AddonPack } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculatePrice = (basePrice: number, qty: number, discount: number | string) => {
    const subtotal = basePrice * qty;
    return subtotal * (1 - Number(discount));
  };

  const getPacksForPlan = (planId: number) => {
    // 1. Check for plan-specific packs first
    const planPacks = packs.filter(p => p.planId === planId);
    if (planPacks.length > 0) return planPacks;
    
    // 2. No plan-specific packs, we default to a SINGLE purchase option
    // This allows addons with no packs to just have a single credit purchase
    // and avoids the global fallback that the user wants to remove.
    return [{ qty: 1, label: "Single", discount: 0 }];
  };

  const handleSelectPack = (plan: PricingPlan, pack: AddonPack) => {
    setSelectedPack({ plan, pack });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {addonPlans.map((plan) => {
          const displayPacks = getPacksForPlan(plan.id);
          
          return (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="text-2xl font-bold">
                  AED {Number(plan.priceOneTime).toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ credit</span>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pack</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayPacks.map((pack) => {
                      const price = calculatePrice(Number(plan.priceOneTime), pack.qty, pack.discount);
                      const isSelected = selectedPack?.plan.id === plan.id && selectedPack?.pack.qty === pack.qty;
                      
                      return (
                        <TableRow key={pack.qty} className={isSelected ? "bg-primary/5" : ""}>
                          <TableCell>
                            <div className="font-medium">{pack.qty} {pack.label}</div>
                            {Number(pack.discount) > 0 && (
                              <Badge variant="secondary" className="text-[10px] px-1 py-0 bg-green-100 text-green-700 hover:bg-green-100">
                                SAVE {(Number(pack.discount) * 100).toFixed(0)}%
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-bold">AED {price.toFixed(2)}</div>
                            {Number(pack.discount) > 0 && (
                              <div className="text-[10px] text-muted-foreground line-through">
                                AED {(Number(plan.priceOneTime) * pack.qty).toFixed(2)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSelectPack(plan, pack)}
                              disabled={!userId}
                            >
                              Select
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedPack && (
        <PayPalCheckoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plan={selectedPack.plan}
          qty={selectedPack.pack.qty}
          userId={userId}
          mode="ADDON"
          priceOverride={calculatePrice(
            Number(selectedPack.plan.priceOneTime),
            selectedPack.pack.qty,
            selectedPack.pack.discount
          )}
        />
      )}

      {!userId && (
        <div className="text-center p-8 bg-muted rounded-lg">
          <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Ready to boost your listings?</h3>
          <p className="text-muted-foreground mb-4">Please login to purchase addon credits and promote your properties.</p>
          <Button onClick={() => window.location.href = "/api/auth/signin"}>Login to Account</Button>
        </div>
      )}
    </div>
  );
}
