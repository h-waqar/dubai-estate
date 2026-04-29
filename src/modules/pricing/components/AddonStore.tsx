"use client";

import { PricingPlan } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import PayPalCheckoutModal from "./PayPalCheckoutModal";

interface AddonPack {
  qty: number;
  label: string;
  discount: any; // Using any to handle Prisma.Decimal
  planId?: number | null;
}

interface AddonStoreProps {
  addonPlans: PricingPlan[];
  userId?: number | string | null;
  packs: AddonPack[];
}

const DEFAULT_PACKS: AddonPack[] = [
  { qty: 1, label: "Single", discount: 0 },
  { qty: 4, label: "Starter Pack", discount: 0.1 },
  { qty: 10, label: "Professional", discount: 0.2 },
];

export function AddonStore({ addonPlans, packs = [] }: AddonStoreProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayPacks = packs.length > 0 ? packs : DEFAULT_PACKS;

  const handlePurchase = (plan: PricingPlan, qty: number) => {
    setSelectedPlan(plan);
    setSelectedQty(qty);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {addonPlans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pack</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayPacks
                    .filter(p => !p.planId || p.planId === plan.id)
                    .map((pack) => {
                    const basePrice = Number(plan.priceOneTime || 0);
                    const discount = Number(pack.discount || 0);
                    const totalPrice = (basePrice * pack.qty * (1 - discount)).toFixed(2);
                    
                    return (
                      <TableRow key={pack.qty}>
                        <TableCell>
                          <div className="font-medium">{pack.label}</div>
                          <div className="text-xs text-muted-foreground">{pack.qty} credits</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-bold">${totalPrice}</div>
                          {discount > 0 && (
                            <Badge variant="secondary" className="text-[10px]">
                              {Math.round(discount * 100)}% OFF
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePurchase(plan, pack.qty)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Buy
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>

      <PayPalCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
        qty={selectedQty}
        mode="ADDON"
      />
    </div>
  );
}
