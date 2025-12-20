"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useProjectAdvertiseStore } from "../../../stores/useProjectAdvertiseStore";
import { useProjectStepStore } from "../../../stores/useProjectStepStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

export default function StepThreePricing() {
    const store = useProjectAdvertiseStore();
    const { next, prev } = useProjectStepStore();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            priceFrom: store.priceFrom,
            currency: store.currency,
            paymentPlanSummary: store.paymentPlanSummary,
            handoverDate: store.handoverDate
                ? new Date(store.handoverDate).toISOString().split("T")[0]
                : "",
        },
    });

    const [paymentStage, setPaymentStage] = React.useState({
        percentage: "",
        description: "",
    });

    const addPaymentStage = () => {
        if (paymentStage.percentage && paymentStage.description) {
            store.addPaymentStage({
                percentage: Number(paymentStage.percentage),
                description: paymentStage.description,
                order: store.paymentPlan.length,
            });
            setPaymentStage({ percentage: "", description: "" });
        }
    };

    const onSubmit = (data: any) => {
        store.update({
            ...data,
            priceFrom: data.priceFrom ? Number(data.priceFrom) : undefined,
            handoverDate: data.handoverDate ? new Date(data.handoverDate) : undefined,
        });
        next();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="priceFrom">Price From (AED)</Label>
                        <Input
                            id="priceFrom"
                            type="number"
                            step="0.01"
                            {...register("priceFrom")}
                            placeholder="1200000"
                        />
                    </div>
                    <div>
                        <Label htmlFor="paymentPlanSummary">Payment Plan Summary</Label>
                        <Input
                            id="paymentPlanSummary"
                            {...register("paymentPlanSummary")}
                            placeholder="e.g., 30/70"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="handoverDate">Handover Date</Label>
                    <div
                        className="cursor-pointer"
                        onClick={() => (document.getElementById('handoverDate') as HTMLInputElement)?.showPicker?.()}
                    >
                        <Input id="handoverDate" type="date" {...register("handoverDate")} />
                    </div>
                </div>

                {/* Payment Plan Stages */}
                <div>
                    <Label>Payment Plan Breakdown</Label>
                    <div className="grid grid-cols-12 gap-2 mb-3">
                        <Input
                            className="col-span-3"
                            type="number"
                            placeholder="10%"
                            value={paymentStage.percentage}
                            onChange={(e) =>
                                setPaymentStage({ ...paymentStage, percentage: e.target.value })
                            }
                        />
                        <Input
                            className="col-span-7"
                            placeholder="On Booking"
                            value={paymentStage.description}
                            onChange={(e) =>
                                setPaymentStage({ ...paymentStage, description: e.target.value })
                            }
                        />
                        <Button
                            type="button"
                            onClick={addPaymentStage}
                            variant="outline"
                            className="col-span-2"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {store.paymentPlan.map((stage, index) => (
                            <div
                                key={stage.id || index}
                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded"
                            >
                                <span className="text-sm">
                                    {stage.percentage}% - {stage.description}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => store.removePaymentStage(stage.id!)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <Button type="button" onClick={prev} variant="outline">
                    Back
                </Button>
                <Button type="submit">Next: Media</Button>
            </div>
        </form>
    );
}
