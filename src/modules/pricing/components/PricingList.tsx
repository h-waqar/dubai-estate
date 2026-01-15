"use client";

import { PricingPlan } from "@/generated/prisma";
import PricingCard from "./PricingCard";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

interface PricingListProps {
  plans: PricingPlan[];
  userId?: number | string | null;
}

export default function PricingList({ plans, userId }: PricingListProps) {
  const initialPayPalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "subscription",
    vault: true,
    debug: process.env.NEXT_PUBLIC_PAYPAL_SANDBOX === "true",
  };

  return (
    <PayPalScriptProvider options={initialPayPalOptions}>
      <>
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} userId={userId} />
        ))}
      </>
    </PayPalScriptProvider>
  );
}
