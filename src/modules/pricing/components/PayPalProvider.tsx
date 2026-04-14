"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

interface PayPalProviderProps {
  children: ReactNode;
}

export default function PayPalProvider({ children }: PayPalProviderProps) {
  const initialPayPalOptions: any = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "subscription",
    vault: true,
    "disable-funding": "venmo",
    debug: process.env.NEXT_PUBLIC_PAYPAL_SANDBOX === "true",
  };

  return (
    <PayPalScriptProvider options={initialPayPalOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
