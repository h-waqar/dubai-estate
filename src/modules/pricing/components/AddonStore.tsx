"use client";

import { PricingPlan } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { createAddonOrderAction, captureAddonOrderAction } from "@/actions/promotions.actions";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";

interface AddonPack {
  qty: number;
  label: string;
  discount: string | number;
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
  const [isProcessing, setIsProcessing] = useState(false);

  const displayPacks = packs.length > 0 ? packs : DEFAULT_PACKS;

  const calculatePrice = (basePrice: number, qty: number, discount: number | string) => {
    const subtotal = basePrice * qty;
    return subtotal * (1 - Number(discount));
  };

  const handleCaptureSuccess = async (details: any) => {
    setIsProcessing(true);
    try {
      const res = await captureAddonOrderAction(details.id);
      if (res.success) {
        toast.success("Purchase successful! Your credits have been added.");
        setSelectedPack(null);
      } else {
        toast.error(res.error || "Failed to capture order");
      }
    } catch (error) {
      toast.error("An error occurred during purchase");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {addonPlans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="text-2xl font-bold">
                ${Number(plan.priceOneTime).toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ credit</span>
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
                          <div className="font-bold">${price.toFixed(2)}</div>
                          {Number(pack.discount) > 0 && (
                            <div className="text-[10px] text-muted-foreground line-through">
                              ${(Number(plan.priceOneTime) * pack.qty).toFixed(2)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => setSelectedPack({ plan, pack })}
                            disabled={!userId}
                          >
                            {isSelected ? "Selected" : "Select"}
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

      {selectedPack && (
        <Card className="border-primary bg-primary/5 max-w-2xl mx-auto">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Checkout: {selectedPack.pack.qty}x {selectedPack.plan.name}</CardTitle>
              <CardDescription>Secure payment via PayPal</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                ${calculatePrice(Number(selectedPack.plan.priceOneTime), selectedPack.pack.qty, selectedPack.pack.discount).toFixed(2)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!userId ? (
              <Button className="w-full" disabled>Login to Purchase</Button>
            ) : isProcessing ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <PayPalButtons
                style={{ layout: "vertical", shape: "rect", label: "buynow" }}
                createOrder={async () => {
                  const amount = calculatePrice(
                    Number(selectedPack.plan.priceOneTime), 
                    selectedPack.pack.qty, 
                    selectedPack.pack.discount
                  ).toFixed(2);
                  
                  const res = await createAddonOrderAction(selectedPack.plan.slug, amount, selectedPack.pack.qty);
                  if (res.success && res.orderId) {
                    return res.orderId;
                  } else {
                    toast.error(res.error || "Failed to create order");
                    throw new Error(res.error);
                  }
                }}
                onApprove={async (data) => {
                  await handleCaptureSuccess(data);
                }}
              />
            )}
            <Button variant="ghost" className="w-full" onClick={() => setSelectedPack(null)}>
              Cancel
            </Button>
          </CardContent>
        </Card>
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
