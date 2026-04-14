"use client";

/**
 * PayPal Subscription Integration Documentation
 * 
 * Architecture:
 * - `PricingList` acts as the container for pricing cards and subscription modals.
 * - `PricingCard` is purely presentational regarding the subscription action, firing an `onSubscribe` event.
 * - `PayPalSubscriptionModal` handles the specific PayPal Button rendering and subscription creation logic.
 * - This component depends on a `PayPalScriptProvider` being present higher in the tree (usually in `PricingPage`).
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

import { PricingPlan, Subscription } from "@prisma/client";
import PricingCard from "./PricingCard";
import { useState } from "react";
import { PayPalSubscriptionModal } from "./PayPalSubscriptionModal";

import { PricingPlanWithEntitlements } from "./PricingCard";

interface PricingListProps {
  plans: PricingPlanWithEntitlements[];
  userId?: number | string | null;
  activeSubscription?: (Subscription & { plan: PricingPlan }) | null;
}

export default function PricingList({ plans, userId, activeSubscription }: PricingListProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubscribe = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="contents">
          {plans.map((plan) => (
          <PricingCard 
              key={plan.id} 
              plan={plan} 
              userId={userId} 
              onSubscribe={handleSubscribe} 
              activeSubscription={activeSubscription}
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
  );
}
