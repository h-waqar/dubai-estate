"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useProjectStepStore } from "../../../stores/useProjectStepStore";
import { CreditCard, Lock, Calendar, Shield, CheckCircle2, Loader2, DollarSign, ArrowRight, Wallet } from "lucide-react";
import { useProjectAdvertiseStore } from "../../../stores/useProjectAdvertiseStore";
import { createProjectAction } from "../../../actions/createProject.action";
import { updateProjectAction } from "../../../actions/updateProject.action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// --- Schema (Unchanged logic) ---
const paymentSchema = z.object({
    paymentMethod: z.enum(["card", "paypal", "pay-later"]),
    cardholderName: z.string().optional(),
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    billingAddress1: z.string().optional(),
    billingAddress2: z.string().optional(),
    billingCity: z.string().optional(),
    billingState: z.string().optional(),
    billingPostalCode: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.paymentMethod === "card") {
        if (!data.cardholderName) ctx.addIssue({ code: "custom", message: "Cardholder name is required", path: ["cardholderName"] });
        if (!data.cardNumber || data.cardNumber.length < 16) ctx.addIssue({ code: "custom", message: "Valid card number required", path: ["cardNumber"] });
        if (!data.expiryDate) ctx.addIssue({ code: "custom", message: "Expiry date is required", path: ["expiryDate"] });
        if (!data.cvv || data.cvv.length < 3) ctx.addIssue({ code: "custom", message: "Valid CVV required", path: ["cvv"] });

        if (!data.billingAddress1) ctx.addIssue({ code: "custom", message: "Address is required", path: ["billingAddress1"] });
        if (!data.billingCity) ctx.addIssue({ code: "custom", message: "City is required", path: ["billingCity"] });
        if (!data.billingState) ctx.addIssue({ code: "custom", message: "State is required", path: ["billingState"] });
        if (!data.billingPostalCode) ctx.addIssue({ code: "custom", message: "Postal code is required", path: ["billingPostalCode"] });
    }
});

type PaymentData = z.infer<typeof paymentSchema>;

// --- Components ---
const FieldWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("space-y-1.5", className)}>{children}</div>
);

const FormLabel = ({ children, required, className }: { children: React.ReactNode; required?: boolean; className?: string }) => (
    <Label className={cn("text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)}>
        {children}
        {required && <span className="text-destructive ml-1">*</span>}
    </Label>
);

const PaymentMethodCard = ({ value, icon: Icon, title, description, selected, onClick }: any) => (
    <div
        onClick={onClick}
        className={cn(
            "relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 group hover:shadow-md",
            selected
                ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                : "border-muted bg-card hover:border-primary/50"
        )}
    >
        <div className={cn(
            "p-3 rounded-full transition-colors",
            selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        )}>
            <Icon className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
            <h3 className={cn("font-bold text-sm", selected ? "text-primary" : "text-foreground")}>{title}</h3>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {selected && (
            <div className="absolute top-3 right-3 text-primary animate-in zoom-in">
                <CheckCircle2 className="w-5 h-5" />
            </div>
        )}
    </div>
);

export default function StepNinePayment({ projectPlan }: { projectPlan?: any }) {
    const { next, prev } = useProjectStepStore();
    const store = useProjectAdvertiseStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const LISTING_FEE = projectPlan?.priceOneTime || 100;

    const initialPayPalOptions = {
        "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
        currency: "USD",
        intent: "capture",
        debug: process.env.NEXT_PUBLIC_PAYPAL_SANDBOX === "true",
    };

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PaymentData>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            paymentMethod: store.paymentMethod || "card",
            cardholderName: store.cardholderName || "",
            cardNumber: store.cardNumber || "",
            expiryDate: store.expiryDate || "",
            cvv: store.cvv || "",
            billingAddress1: store.billingAddress1 || "",
            billingAddress2: store.billingAddress2 || "",
            billingCity: store.billingCity || "",
            billingState: store.billingState || "",
            billingPostalCode: store.billingPostalCode || "",
        },
    });

    const currentMethod = watch("paymentMethod");

    // Sync form -> store
    useEffect(() => {
        const subscription = watch((value) => {
            store.update({
                paymentMethod: value.paymentMethod as any,
                cardholderName: value.cardholderName,
                cardNumber: value.cardNumber, // In real app, consider security
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
    }, [watch, store]);

    const onSubmit = async (data: PaymentData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            // Core Data
            formData.append("name", store.name);
            formData.append("developerId", store.developerId?.toString() || "");
            formData.append("description", store.description);
            formData.append("projectType", store.projectType);
            if (store.handoverDate) formData.append("handoverDate", store.handoverDate.toISOString());

            // Location
            formData.append("location", store.location);
            if (store.latitude) formData.append("latitude", store.latitude.toString());
            if (store.longitude) formData.append("longitude", store.longitude.toString());
            formData.append("locationDescription", store.locationDescription || "");

            // Features & Content
            formData.append("aboutContent", store.aboutContent || "");
            formData.append("tagline", store.tagline || "");
            formData.append("highlights", JSON.stringify(store.highlights));
            formData.append("aboutFeatures", JSON.stringify(store.aboutFeatures));

            // Progress
            if (store.progressPercentage) formData.append("progressPercentage", store.progressPercentage.toString());
            if (store.progressStatus) formData.append("progressStatus", store.progressStatus);
            if (store.progressImage) formData.append("progressImage", JSON.stringify(store.progressImage));

            // Pricing
            formData.append("priceFrom", store.priceFrom?.toString() || "");
            formData.append("currency", store.currency);
            formData.append("paymentPlanSummary", store.paymentPlanSummary || "");
            formData.append("paymentPlan", JSON.stringify(store.paymentPlan));

            // Media & Relations
            if (store.logo) formData.append("logoId", store.logo.id.toString());
            if (store.coverImage) formData.append("coverImageId", store.coverImage.id.toString());

            // Map gallery to just IDs
            const galleryIds = store.gallery.map(g => g.id);
            formData.append("galleryIds", JSON.stringify(galleryIds));

            formData.append("floorplans", JSON.stringify(store.floorplans));
            formData.append("selectedAmenities", JSON.stringify(store.selectedAmenities));
            formData.append("nearbyAttractions", JSON.stringify(store.nearbyAttractions));
            formData.append("faqs", JSON.stringify(store.faqs));

            // Account
            if (store.username) formData.append("username", store.username);
            if (store.email) formData.append("email", store.email);
            if (store.password) formData.append("password", store.password);

            // Payment
            formData.append("paymentMethod", data.paymentMethod);

            let result;
            if (store.id) {
                // UPDATE MODE
                formData.append("id", store.id.toString());
                result = await updateProjectAction(formData);
            } else {
                // CREATE MODE
                result = await createProjectAction(formData);
            }

            if (result.success) {
                toast.success(store.id ? "Project updated successfully!" : "Transaction approved. Creating project...");
                next();
            } else {
                toast.error("Submission failed: " + JSON.stringify(result.error));
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Formatters
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        let value = e.target.value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
        if (value.length <= 19) onChange(value);
    };
    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 2) value = value.slice(0, 2) + " / " + value.slice(2, 4);
        if (value.length <= 7) onChange(value);
    };
    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        onChange(e.target.value.replace(/\D/g, "").slice(0, 4));
    };

    return (
        <PayPalScriptProvider options={initialPayPalOptions}>
            <form onSubmit={handleSubmit(onSubmit, (e) => console.error("Form Errors", e))} className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Payment Method & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-2">Checkout</h2>
                            <p className="text-muted-foreground">Choose how you'd like to pay for your project listing.</p>
                        </div> */}

                        {/* Payment Method Grid */}
                        <div className="space-y-4">
                            <Label className="text-base font-semibold">Payment Method</Label>
                            <Controller
                                name="paymentMethod"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <PaymentMethodCard
                                            title="Card"
                                            icon={CreditCard}
                                            selected={field.value === "card"}
                                            onClick={() => field.onChange("card")}
                                        />
                                        <PaymentMethodCard
                                            title="PayPal"
                                            icon={DollarSign}
                                            selected={field.value === "paypal"}
                                            onClick={() => field.onChange("paypal")}
                                        />
                                        <PaymentMethodCard
                                            title="Pay Later"
                                            icon={Calendar}
                                            description="Pay via Dashboard"
                                            selected={field.value === "pay-later"}
                                            onClick={() => field.onChange("pay-later")}
                                        />
                                    </div>
                                )}
                            />
                        </div>

                        {/* Dynamic Content Area */}
                        <div className="min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {currentMethod === "card" && (
                                    <motion.div
                                        key="card-form"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6 bg-card border rounded-xl p-6 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between pb-4 border-b">
                                            <h3 className="font-semibold text-lg">Card Details</h3>
                                            <div className="flex gap-2">
                                                {/* Card Icons placeholder */}
                                                <div className="w-8 h-5 bg-gray-200 rounded" />
                                                <div className="w-8 h-5 bg-gray-200 rounded" />
                                            </div>
                                        </div>

                                        <FieldWrapper>
                                            <FormLabel required>Cardholder Name</FormLabel>
                                            <Input {...register("cardholderName")} placeholder="e.g. John Doe" className="h-11" />
                                            {errors.cardholderName && <p className="text-sm text-red-500">{errors.cardholderName.message}</p>}
                                        </FieldWrapper>

                                        <FieldWrapper>
                                            <FormLabel required>Card Number</FormLabel>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><CreditCard className="w-4 h-4" /></div>
                                                <Controller
                                                    name="cardNumber"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            onChange={(e) => handleCardNumberChange(e, field.onChange)}
                                                            placeholder="0000 0000 0000 0000"
                                                            className="pl-10 h-11 font-mono tracking-wide"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber.message}</p>}
                                        </FieldWrapper>

                                        <div className="grid grid-cols-2 gap-4">
                                            <FieldWrapper>
                                                <FormLabel required>Expiry</FormLabel>
                                                <Controller
                                                    name="expiryDate"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            onChange={(e) => handleExpiryDateChange(e, field.onChange)}
                                                            placeholder="MM / YY"
                                                            className="h-11 font-mono text-center"
                                                        />
                                                    )}
                                                />
                                                {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate.message}</p>}
                                            </FieldWrapper>
                                            <FieldWrapper>
                                                <FormLabel required>CVV</FormLabel>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Lock className="w-4 h-4" /></div>
                                                    <Controller
                                                        name="cvv"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                onChange={(e) => handleCvvChange(e, field.onChange)}
                                                                type="password"
                                                                placeholder="123"
                                                                className="pl-10 h-11 font-mono"
                                                                maxLength={4}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                {errors.cvv && <p className="text-sm text-red-500">{errors.cvv.message}</p>}
                                            </FieldWrapper>
                                        </div>

                                        <div className="pt-4 border-t space-y-4">
                                            <h3 className="font-semibold">Billing Address</h3>
                                            <FieldWrapper>
                                                <FormLabel required>Street Address</FormLabel>
                                                <Input {...register("billingAddress1")} className="h-11" />
                                                {errors.billingAddress1 && <p className="text-sm text-red-500">{errors.billingAddress1.message}</p>}
                                            </FieldWrapper>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FieldWrapper>
                                                    <FormLabel required>City</FormLabel>
                                                    <Input {...register("billingCity")} className="h-11" />
                                                    {errors.billingCity && <p className="text-sm text-red-500">{errors.billingCity.message}</p>}
                                                </FieldWrapper>
                                                <FieldWrapper>
                                                    <FormLabel required>State / Zip</FormLabel>
                                                    <div className="flex gap-2">
                                                        <Input {...register("billingState")} placeholder="State" className="h-11" />
                                                        <Input {...register("billingPostalCode")} placeholder="Zip" className="h-11" />
                                                    </div>
                                                    {errors.billingPostalCode && <p className="text-sm text-red-500">{errors.billingPostalCode.message}</p>}
                                                </FieldWrapper>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentMethod === "paypal" && (
                                    <motion.div
                                        key="paypal-box"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-xl p-8 text-center space-y-6"
                                    >
                                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="max-w-xs mx-auto space-y-2">
                                            <h3 className="font-bold text-lg">Pay with PayPal</h3>
                                            <p className="text-sm text-muted-foreground">Complete your payment securely through PayPal's portal.</p>
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
                                                                value: String(LISTING_FEE)
                                                            }
                                                        }]
                                                    });
                                                }}
                                                onApprove={async (data, actions) => {
                                                    const details = await actions.order?.capture();
                                                    if (details?.status === "COMPLETED") {
                                                        toast.success("Payment successful!");
                                                        onSubmit({ ...watch(), paymentMethod: "paypal" });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {currentMethod === "pay-later" && (
                                    <motion.div
                                        key="pay-later-box"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900 rounded-xl p-8 text-center space-y-6"
                                    >
                                        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Wallet className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <div className="max-w-md mx-auto space-y-2">
                                            <h3 className="font-bold text-lg">Submit Now, Pay Later</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Your project will be submitted for review immediately.
                                                You can complete the payment anytime from your publisher dashboard before the listing goes live.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-1">
                        {/* <div className="sticky top-24 space-y-6"> */}
                        <div className="sticky top-10 space-y-6">

                            {/* Summary Card */}
                            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                                <div className="bg-muted/30 p-4 border-b">
                                    <h3 className="font-bold">Order Summary</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start text-sm">
                                        <div className="space-y-1">
                                            <p className="font-medium text-foreground">Project Listing Fee</p>
                                            <p className="text-xs text-muted-foreground">Standard processing</p>
                                        </div>
                                        <span className="font-semibold">${LISTING_FEE.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                                        <span>Tax (0%)</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="h-px bg-border my-2" />
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-bold text-lg">Total</span>
                                        <span className="font-bold text-2xl text-primary">${LISTING_FEE.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/30 border-t">
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold uppercase text-green-700 dark:text-green-500">Secure Payment</p>
                                            <p className="text-[10px] text-muted-foreground leading-tight">
                                                Your payment is encrypted and secure. We do not store your full card details.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-4">
                                {currentMethod !== "paypal" && (
                                    <Button
                                        onClick={handleSubmit(onSubmit, (e) => console.error("Submit Errors", e))}
                                        disabled={isSubmitting}
                                        className="w-full h-12 text-base shadow-lg shadow-primary/20"
                                        size="lg"
                                    >
                                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                        {currentMethod === "pay-later" ? "Submit Application" : `Pay $${LISTING_FEE.toFixed(2)}`}
                                        {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    onClick={prev}
                                    disabled={isSubmitting}
                                    className="w-full text-muted-foreground hover:text-foreground"
                                >
                                    Back
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
        </PayPalScriptProvider>
    );
}

