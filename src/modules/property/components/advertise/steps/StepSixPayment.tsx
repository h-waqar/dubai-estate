// src\modules\property\components\advertise\steps\StepSixPayment.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import StepController from "./StepController";
import { useStepStore } from "../../../stores/useStepStore";
import { CreditCard, Lock, Calendar, Shield, CheckCircle2, Loader2 } from "lucide-react";
import { useAdvertiseFormStore } from "../../../stores/useAdvertiseForm";
import { createPropertyAction } from "../../../actions/createProperty";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FormLabel, FieldWrapper, InputIcon } from "../FormComponents";
import { stepSixSchema } from "../../../validators/advertise-steps.validator";
import { z } from "zod";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface StepSixPaymentProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  serverData: {
    features?: { id: number; name: string; slug: string }[];
  };
}

type StepSixData = z.infer<typeof stepSixSchema>;

function StepSixPayment({ propertyTypes, serverData }: StepSixPaymentProps) {
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
    listingType,
    coverImage,
    gallery,
    location,
    latitude,
    longitude,
    reset,
  } = useAdvertiseFormStore();

  const initialPayPalOptions = {
    "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "capture",
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StepSixData>({
    resolver: zodResolver(stepSixSchema),
    defaultValues: {
      paymentMethod: paymentMethod || "card",
      cardholderName: cardholderName || "",
      cardNumber: cardNumber || "",
      expiryDate: expiryDate || "",
      cvv: cvv || "",
      billingAddress1: billingAddress1 || "",
      billingAddress2: billingAddress2 || "",
      billingCity: billingCity || "",
      billingState: billingState || "",
      billingPostalCode: billingPostalCode || "",
    },
  });

  // Sync form -> store
  useEffect(() => {
    const subscription = watch((value) => {
      update({
        paymentMethod: value.paymentMethod,
        cardholderName: value.cardholderName,
        cardNumber: value.cardNumber,
        expiryDate: value.expiryDate,
        cvv: value.cvv,
        billingAddress1: value.billingAddress1,
        billingAddress2: value.billingAddress2,
        billingCity: value.billingCity,
        billingState: value.billingState,
        billingPostalCode: value.billingPostalCode,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, update]);

  const onSubmit = async (data: StepSixData) => {
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

      // Use actual location from store, fallback to "Dubai" only if missing
      formData.append("location", location || "Dubai");
      if (latitude) formData.append("latitude", latitude.toString());
      if (longitude) formData.append("longitude", longitude.toString());

      // Pass listingType (critical fix for validation)
      if (plan) formData.append("listingType", listingType || "SALE");
      // Note: `plan` variable in store is about payment/subscription, `listingType` is SALE/RENT.

      formData.append("furnishing", furnishing || "UNFURNISHED");
      formData.append("description", description || "");

      if (features && features.length > 0) {
        const availableFeatures = serverData.features || [];
        // features[] in store is array of strings (names), so we need to find the ID
        features.forEach((featureName) => {
          // If for some reason it's already an object (legacy?), handle it, otherwise find by name
          const name = typeof featureName === 'string' ? featureName : (featureName as any).name;
          const featureObj = availableFeatures.find(f => f.name === name);
          if (featureObj) {
            formData.append("features[]", featureObj.id.toString());
          }
        });
      }

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
        reset(); // Reset form data
        // We might not want to reset step store immediately if we navigate to "Success" step
        // But if "next()" goes to Success step, we should let it.
        // The Success step component can handle cleaning up the step store on unmount or on "Go to Dashboard" click.
        // However, the user asked to clear data "when submit is clicked".
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

  // Custom formatting handlers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    let value = e.target.value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
    if (value.length <= 19) {
      onChange(value);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + " / " + value.slice(2, 4);
    }
    if (value.length <= 7) {
      onChange(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    onChange(value);
  };

  return (
    <PayPalScriptProvider options={initialPayPalOptions}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  className="space-y-3"
                >
                  {/* Credit/Debit Card */}
                  <Label
                    htmlFor="payment-card"
                    className={cn(
                      "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                      (field.value === "card" || !field.value) &&
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

                  {/* PayPal */}
                  <Label
                    htmlFor="payment-paypal"
                    className={cn(
                      "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                      field.value === "paypal" && "border-primary bg-muted"
                    )}
                  >
                    <RadioGroupItem value="paypal" id="payment-paypal" />
                    {/* Simple text icon or you can import a PayPal icon */}
                    <div className="w-5 h-5 flex items-center justify-center font-bold text-blue-700 italic">
                      P
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">PayPal</p>
                      <p className="text-sm text-muted-foreground">
                        Pay securely with your PayPal account
                      </p>
                    </div>
                  </Label>

                  {/* Pay Later */}
                  <Label
                    htmlFor="payment-later"
                    className={cn(
                      "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                      field.value === "pay-later" && "border-primary bg-muted"
                    )}
                  >
                    <RadioGroupItem value="pay-later" id="payment-later" />
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-semibold">Pay Later</p>
                      <p className="text-sm text-muted-foreground">
                        Submit your application now and pay upon approval
                      </p>
                    </div>
                  </Label>
                </RadioGroup>
              )}
            />
            {errors.paymentMethod && (
              <p className="text-sm text-destructive mt-1">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Card Details Form - Only show if Card is selected */}
          {watch("paymentMethod") === "card" && (
            <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-lg font-medium border-b pb-2">Card Details</h3>

              {/* Cardholder Name */}
              <FieldWrapper>
                <FormLabel required>Cardholder Name</FormLabel>
                <div className="relative">
                  <Input
                    {...register("cardholderName")}
                    placeholder="John Doe"
                    className="h-12 border-input bg-background"
                  />
                </div>
                {errors.cardholderName && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.cardholderName.message}
                  </p>
                )}
              </FieldWrapper>

              {/* Card Number */}
              <FieldWrapper>
                <FormLabel required>Card Number</FormLabel>
                <div className="relative">
                  <InputIcon icon={CreditCard} />
                  <Controller
                    name="cardNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) => handleCardNumberChange(e, field.onChange)}
                        placeholder="1234 5678 9012 3456"
                        className="h-12 pl-10 border-input bg-background font-mono"
                        maxLength={19}
                      />
                    )}
                  />
                </div>
                {errors.cardNumber && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.cardNumber.message}
                  </p>
                )}
              </FieldWrapper>

              {/* Expiry Date and CVV */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldWrapper>
                  <FormLabel required>Expiry Date</FormLabel>
                  <div className="relative">
                    <InputIcon icon={Calendar} />
                    <Controller
                      name="expiryDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          onChange={(e) => handleExpiryDateChange(e, field.onChange)}
                          placeholder="MM / YY"
                          className="h-12 pl-10 border-input bg-background font-mono"
                          maxLength={7}
                        />
                      )}
                    />
                  </div>
                  {errors.expiryDate && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.expiryDate.message}
                    </p>
                  )}
                </FieldWrapper>
                <FieldWrapper>
                  <FormLabel required>CVV</FormLabel>
                  <div className="relative">
                    <InputIcon icon={Lock} />
                    <Controller
                      name="cvv"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="password"
                          onChange={(e) => handleCvvChange(e, field.onChange)}
                          placeholder="123"
                          className="h-12 pl-10 border-input bg-background font-mono"
                          maxLength={4}
                        />
                      )}
                    />
                  </div>
                  {errors.cvv && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.cvv.message}
                    </p>
                  )}
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
                    {...register("billingAddress1")}
                    placeholder="123 Main Street"
                    className="h-12 border-input bg-background"
                  />
                  {errors.billingAddress1 && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.billingAddress1.message}
                    </p>
                  )}
                </FieldWrapper>

                <FieldWrapper>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <Input
                    {...register("billingAddress2")}
                    placeholder="Apartment, suite, etc."
                    className="h-12 border-input bg-background"
                  />
                </FieldWrapper>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FieldWrapper>
                    <FormLabel required>City</FormLabel>
                    <Input
                      {...register("billingCity")}
                      placeholder="Dubai"
                      className="h-12 border-input bg-background"
                    />
                    {errors.billingCity && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.billingCity.message}
                      </p>
                    )}
                  </FieldWrapper>
                  <FieldWrapper>
                    <FormLabel required>State / Province</FormLabel>
                    <Input
                      {...register("billingState")}
                      placeholder="Dubai"
                      className="h-12 border-input bg-background"
                    />
                    {errors.billingState && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.billingState.message}
                      </p>
                    )}
                  </FieldWrapper>
                  <FieldWrapper>
                    <FormLabel required>Postal Code</FormLabel>
                    <Input
                      {...register("billingPostalCode")}
                      placeholder="12345"
                      className="h-12 border-input bg-background"
                    />
                    {errors.billingPostalCode && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.billingPostalCode.message}
                      </p>
                    )}
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

          {/* PayPal UI */}
          {watch("paymentMethod") === "paypal" && (
            <div className="pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  You will be redirected to PayPal to securely complete your payment.
                </p>
              </div>
              <div className="max-w-[300px] mx-auto relative z-0">
                <PayPalButtons
                  style={{ layout: "vertical", shape: "rect", label: "pay" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [{
                        amount: {
                          currency_code: "USD",
                          value: plan === "gold" ? "25" : "10"
                        }
                      }]
                    });
                  }}
                  onApprove={async (data, actions) => {
                    const details = await actions.order?.capture();
                    if (details?.status === "COMPLETED") {
                      toast.success("Payment successful!");
                      onSubmit({ ...watch(), paymentMethod: "paypal" });
                      // onSubmit handles the reset
                    }
                  }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <button
            type="button"
            onClick={prev}
            className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Back
          </button>
          <div className="flex gap-3">
            {/* Hide default submit button if PayPal is selected */}
            {watch("paymentMethod") !== "paypal" && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {watch("paymentMethod") === "pay-later" ? "Submit Application" : "Submit & Pay"}
              </button>
            )}
          </div>
        </div>
      </form>
    </PayPalScriptProvider>
  );
}
export default StepSixPayment;
