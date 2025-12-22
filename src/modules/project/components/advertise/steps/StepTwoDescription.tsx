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
    const [attractionName, setAttractionName] = React.useState("");
    const [attractionDistance, setAttractionDistance] = React.useState("");

    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            description: store.description,
            tagline: store.tagline || "",
            aboutContent: store.aboutContent || "",
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

    const addAttraction = () => {
        if (attractionName.trim() && attractionDistance.trim()) {
            store.update({
                nearbyAttractions: [
                    ...store.nearbyAttractions,
                    {
                        name: attractionName.trim(),
                        distance: attractionDistance.trim(),
                        order: store.nearbyAttractions.length,
                    },
                ],
            });
            setAttractionName("");
            setAttractionDistance("");
        }
    };

    const removeAttraction = (index: number) => {
        store.update({
            nearbyAttractions: store.nearbyAttractions.filter((_, i) => i !== index),
        });
    };

    const onSubmit = (data: any) => {
        store.update(data);
        next();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
                {/* Tagline */}
                <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                        id="tagline"
                        {...register("tagline")}
                        placeholder="e.g., Luxury Living by the Marina"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Optional: A catchy headline for the About section
                    </p>
                </div>

                {/* Description */}
                <div>
                    <Label htmlFor="description">Short Description</Label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        rows={4}
                        placeholder="Brief project description (used in listings)..."
                        className="resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {description?.length || 0} characters
                    </p>
                </div>

                {/* About Content */}
                <div>
                    <Label htmlFor="aboutContent">Full About Content</Label>
                    <Textarea
                        id="aboutContent"
                        {...register("aboutContent")}
                        rows={6}
                        placeholder="Detailed description for the About section..."
                        className="resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Optional: Falls back to description if empty
                    </p>
                </div>

                {/* Project Progress */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Project Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="progressPercentage">Progress Percentage (%)</Label>
                            <Input
                                id="progressPercentage"
                                type="number"
                                min="0"
                                max="100"
                                value={store.progressPercentage || ""}
                                onChange={(e) => store.update({ progressPercentage: Number(e.target.value) })}
                                placeholder="e.g., 65"
                            />
                        </div>
                        <div>
                            <Label htmlFor="progressStatus">Current Status</Label>
                            <Input
                                id="progressStatus"
                                value={store.progressStatus || ""}
                                onChange={(e) => store.update({ progressStatus: e.target.value })}
                                placeholder="e.g., Under Construction"
                            />
                        </div>
                    </div>
                </div>

                {/* Nearby Attractions */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Nearby Attractions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Add key locations near the project for the location map section.
                    </p>

                    <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-3">
                        <Input
                            id="attractionName"
                            value={attractionName}
                            onChange={(e) => setAttractionName(e.target.value)}
                            placeholder="Place Name (e.g. Dubai Mall)"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    // Focus next input
                                    document.getElementById("attractionDistance")?.focus();
                                }
                            }}
                        />
                        <Input
                            id="attractionDistance"
                            value={attractionDistance}
                            onChange={(e) => setAttractionDistance(e.target.value)}
                            placeholder="Distance (e.g. 10 mins)"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addAttraction();
                                }
                            }}
                        />
                        <Button type="button" onClick={addAttraction} variant="outline">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Nearby Attractions List */}
                    <div className="space-y-2">
                        {store.nearbyAttractions.map((attraction, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{attraction.name}</span>
                                    <span className="text-xs text-gray-500">{attraction.distance}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeAttraction(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
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
