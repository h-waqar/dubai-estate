"use client";

/**
 * PayPal Subscription Integration Documentation
 * 
 * Architecture:
 * - `PricingList` acts as the container and context provider (`PayPalScriptProvider`).
 * - `PricingCard` is purely presentational regarding the subscription action, firing an `onSubscribe` event.
 * - `PayPalSubscriptionModal` handles the specific PayPal Button rendering and subscription creation logic.
 * 
 * Environment Variables Required:
 * - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: Your PayPal Client ID.
 * - `NEXT_PUBLIC_PAYPAL_SANDBOX`: Set to "true" for sandbox mode.
 * - `NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD`: PayPal Plan ID for the 'Gold' plan (fallback if not in DB).
 * - `NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER`: PayPal Plan ID for the 'Silver' plan (fallback if not in DB).
 * 
 * Setup:
 * - The PayPal SDK is loaded asynchronously via `@paypal/react-paypal-js`.
 * - Plan IDs should ideally be stored in the database (`PricingPlan.paypalPlanId`).
 * - Fallback IDs in `PayPalSubscriptionModal` are used if the DB field is empty.
 */

import { PricingPlan } from "@prisma/client";
import PricingCard from "./PricingCard";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";
import { PayPalSubscriptionModal } from "./PayPalSubscriptionModal";

interface PricingListProps {
  plans: PricingPlan[];
  userId?: number | string | null;
}

export default function PricingList({ plans, userId }: PricingListProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialPayPalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "subscription",
    vault: true,
    debug: process.env.NEXT_PUBLIC_PAYPAL_SANDBOX === "true",
  };

  const handleSubscribe = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PayPalScriptProvider options={initialPayPalOptions}>
      <>
        <div className="contents">
            {plans.map((plan) => (
            <PricingCard 
                key={plan.id} 
                plan={plan} 
                userId={userId} 
                onSubscribe={handleSubscribe} 
            />
            ))}
        </div>

        <PayPalSubscriptionModal 
          plan={selectedPlan} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          userId={userId}
        />
      </>
    </PayPalScriptProvider>
  );
}
