// src\modules\property\components\advertise\steps\StepSixPayment.tsx
"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import StepController from "./StepController";
import { useStepStore } from "../../../stores/useStepStore";
import { CreditCard, Lock, Calendar, Shield, CheckCircle2 } from "lucide-react";
import { useAdvertiseFormStore } from "../../../stores/useAdvertiseForm";
import { createPropertyAction } from "../../../actions/createProperty";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FormLabel, FieldWrapper, InputIcon } from "../FormComponents";

interface StepSixPaymentProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  serverData: {
    features?: { id: number; name: string; slug: string }[];
  };
}

function StepSixPayment({ propertyTypes }: StepSixPaymentProps) {
  const { next, prev } = useStepStore();
  const {
    plan,
    paymentMethod,
    cardholderName,
    cardNumber,
    expiryDate,
    cvv,
    billingAddress1,
    billingAddress2,
    billingCity,
    billingState,
    billingPostalCode,
    update,
    // Get all data for submission
    title,
    propertyStatus,
    propertyTypeId,
    description,
    keywords,
    features,
    price,
    currency,
    bedrooms,
    bathrooms,
    propertySize,
    furnishing,
    coverImage,
    gallery,
  } = useAdvertiseFormStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler for all input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    // Format card number with spaces
    if (name === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      if (value.length > 19) return; // Limit to 16 digits + 3 spaces
    }

    // Format expiry date
    if (name === "expiryDate") {
      value = value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.slice(0, 2) + " / " + value.slice(2, 4);
      }
      if (value.length > 7) return;
    }

    // Limit CVV to 3-4 digits
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }

    update({ [name]: value });
  };

  // Handler for payment method selection
  const handlePaymentMethodChange = (value: string) => {
    update({ paymentMethod: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price?.toString() || "0");

      if (!propertyTypeId || !propertyTypes.some(t => t.id === propertyTypeId)) {
        toast.error("Invalid Property Type. Please go back to Step 1 and select a valid type.");
        return;
      }
      formData.append("propertyTypeId", propertyTypeId.toString());
      formData.append("bedrooms", bedrooms?.toString() || "0");
      formData.append("bathrooms", bathrooms?.toString() || "0");
      formData.append("location", "Dubai"); // Hardcoded for now or get from store if available
      formData.append("furnishing", furnishing || "UNFURNISHED");
      formData.append("description", description);
      
      if (coverImage) {
        formData.append("coverImage", coverImage.id.toString());
      }
      
      gallery.forEach((img) => {
        formData.append("gallery[]", img.id.toString());
      });

      // Add other fields if needed by the action
      
      const result = await createPropertyAction(formData);
      
      if (result.success) {
        toast.success("Property created successfully!");
        next();
      } else {
        console.error(result.error);
        toast.error("Failed to create property: " + JSON.stringify(result.error));
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Card container */}
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">06 Payment Details</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Your payment information is secure and encrypted
          </p>
        </div>

        {/* Selected Plan Summary */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">
                {plan === "gold" ? "Gold Package" : "Silver Package"}
              </p>
              <p className="text-sm text-muted-foreground">
                {plan === "gold"
                  ? "Featured display with premium visibility"
                  : "Standard monthly ad display"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                ${plan === "gold" ? "25" : "10"}
              </p>
              <p className="text-xs text-muted-foreground">/month</p>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Payment Method</h3>
          <RadioGroup
            value={paymentMethod || "card"}
            onValueChange={handlePaymentMethodChange}
          >
            {/* Credit/Debit Card */}
            <Label
              htmlFor="payment-card"
              className={cn(
                "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                (paymentMethod === "card" || !paymentMethod) &&
                  "border-primary bg-muted"
              )}
            >
              <RadioGroupItem value="card" id="payment-card" />
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-semibold">Credit / Debit Card</p>
                <p className="text-sm text-muted-foreground">
                  Visa, Mastercard, American Express
                </p>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-7 bg-linear-to-br from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div className="w-10 h-7 bg-linear-to-br from-red-600 to-orange-400 rounded flex items-center justify-center text-white text-xs font-bold">
                  MC
                </div>
              </div>
            </Label>
          </RadioGroup>
        </div>

        {/* Card Details Form */}
        {(paymentMethod === "card" || !paymentMethod) && (
          <div className="space-y-6 pt-2">
            <h3 className="text-lg font-medium border-b pb-2">Card Details</h3>

            {/* Cardholder Name */}
            <FieldWrapper>
              <FormLabel required>Cardholder Name</FormLabel>
              <div className="relative">
                <Input
                  name="cardholderName"
                  value={cardholderName || ""}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="h-12 border-input bg-background"
                />
              </div>
            </FieldWrapper>

            {/* Card Number */}
            <FieldWrapper>
              <FormLabel required>Card Number</FormLabel>
              <div className="relative">
                <InputIcon icon={CreditCard} />
                <Input
                  name="cardNumber"
                  value={cardNumber || ""}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className="h-12 pl-10 border-input bg-background font-mono"
                  maxLength={19}
                />
              </div>
            </FieldWrapper>

            {/* Expiry Date and CVV */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldWrapper>
                <FormLabel required>Expiry Date</FormLabel>
                <div className="relative">
                  <InputIcon icon={Calendar} />
                  <Input
                    name="expiryDate"
                    value={expiryDate || ""}
                    onChange={handleChange}
                    placeholder="MM / YY"
                    className="h-12 pl-10 border-input bg-background font-mono"
                    maxLength={7}
                  />
                </div>
              </FieldWrapper>
              <FieldWrapper>
                <FormLabel required>CVV</FormLabel>
                <div className="relative">
                  <InputIcon icon={Lock} />
                  <Input
                    name="cvv"
                    type="password"
                    value={cvv || ""}
                    onChange={handleChange}
                    placeholder="123"
                    className="h-12 pl-10 border-input bg-background font-mono"
                    maxLength={4}
                  />
                </div>
              </FieldWrapper>
            </div>

            {/* Billing Address */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium border-b pb-2">
                Billing Address
              </h3>

              <FieldWrapper>
                <FormLabel required>Address Line 1</FormLabel>
                <Input
                  name="billingAddress1"
                  value={billingAddress1 || ""}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className="h-12 border-input bg-background"
                />
              </FieldWrapper>

              <FieldWrapper>
                <FormLabel>Address Line 2 (Optional)</FormLabel>
                <Input
                  name="billingAddress2"
                  value={billingAddress2 || ""}
                  onChange={handleChange}
                  placeholder="Apartment, suite, etc."
                  className="h-12 border-input bg-background"
                />
              </FieldWrapper>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FieldWrapper>
                  <FormLabel required>City</FormLabel>
                  <Input
                    name="billingCity"
                    value={billingCity || ""}
                    onChange={handleChange}
                    placeholder="Dubai"
                    className="h-12 border-input bg-background"
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FormLabel required>State / Province</FormLabel>
                  <Input
                    name="billingState"
                    value={billingState || ""}
                    onChange={handleChange}
                    placeholder="Dubai"
                    className="h-12 border-input bg-background"
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FormLabel required>Postal Code</FormLabel>
                  <Input
                    name="billingPostalCode"
                    value={billingPostalCode || ""}
                    onChange={handleChange}
                    placeholder="12345"
                    className="h-12 border-input bg-background"
                  />
                </FieldWrapper>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Secure Payment
                </p>
                <p className="text-xs text-muted-foreground">
                  Your payment information is encrypted and secure
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <button
          onClick={prev}
          className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
          >
            Pay Later
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit & Pay
          </button>
        </div>
      </div>
    </div>
  );
}

export default StepSixPayment;
