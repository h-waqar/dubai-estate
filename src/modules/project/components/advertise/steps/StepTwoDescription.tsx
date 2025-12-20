"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useProjectAdvertiseStore } from "../../../stores/useProjectAdvertiseStore";
import { useProjectStepStore } from "../../../stores/useProjectStepStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

export default function StepTwoDescription() {
    const store = useProjectAdvertiseStore();
    const { next, prev } = useProjectStepStore();
    const [highlightInput, setHighlightInput] = React.useState("");

    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            description: store.description,
        },
    });

    const description = watch("description");

    const addHighlight = () => {
        if (highlightInput.trim()) {
            store.update({
                highlights: [...store.highlights, highlightInput.trim()],
            });
            setHighlightInput("");
        }
    };

    const removeHighlight = (index: number) => {
        store.update({
            highlights: store.highlights.filter((_, i) => i !== index),
        });
    };

    const onSubmit = (data: any) => {
        store.update(data);
        next();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
                {/* Description */}
                <div>
                    <Label htmlFor="description">About the Project</Label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        rows={6}
                        placeholder="Describe the project in detail..."
                        className="resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {description?.length || 0} characters
                    </p>
                </div>

                {/* Highlights */}
                <div>
                    <Label>Key Highlights</Label>
                    <div className="flex gap-2 mb-3">
                        <Input
                            value={highlightInput}
                            onChange={(e) => setHighlightInput(e.target.value)}
                            placeholder="e.g., Near Al Furjan Metro Station"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addHighlight();
                                }
                            }}
                        />
                        <Button type="button" onClick={addHighlight} variant="outline">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Highlights List */}
                    <div className="space-y-2">
                        {store.highlights.map((highlight, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded"
                            >
                                <span className="text-sm">{highlight}</span>
                                <button
                                    type="button"
                                    onClick={() => removeHighlight(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button type="button" onClick={prev} variant="outline">
                    Back
                </Button>
                <Button type="submit">Next: Pricing</Button>
            </div>
        </form>
    );
}
