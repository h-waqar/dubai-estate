"use client";

import React, { useState } from "react";
import { useProjectAdvertiseStore } from "../../../stores/useProjectAdvertiseStore";
import { useProjectStepStore } from "../../../stores/useProjectStepStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
    Plus, X, ChevronDown,
    Building2, MapPin, Home, Calendar, DollarSign, Users, Car, TreePine,
    Waves, Sun, Moon, Star, Check, Shield, Award, Heart, Clock, Zap
} from "lucide-react";
import MediaLibraryButton from "@/modules/media/components/MediaLibraryButton";
import Image from "next/image";
import type { Media } from "@/modules/media/types/media.types";

// Map of icon names to components for rendering
const ICON_MAP: Record<string, React.ComponentType<any>> = {
    Building2, MapPin, Home, Calendar, DollarSign, Users, Car, TreePine,
    Waves, Sun, Moon, Star, Check, Shield, Award, Heart, Clock, Zap
};

// Common Lucide icons for projects (keys matching the map)
const COMMON_ICONS = Object.keys(ICON_MAP);

export default function StepTwoPointFiveAboutFeatures() {
    const store = useProjectAdvertiseStore();
    const { next, prev } = useProjectStepStore();
    const [featureName, setFeatureName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("Building2");
    const [customIcon, setCustomIcon] = useState<Media | undefined>(undefined);

    const handleAddFeature = () => {
        if (featureName.trim()) {
            store.addAboutFeature({
                name: featureName.trim(),
                icon: customIcon ? "" : selectedIcon, // Empty string if custom icon used
                customIcon: customIcon,
                order: store.aboutFeatures.length,
            });
            setFeatureName("");

            // Should reset custom icon but maybe keep selected icon
            setCustomIcon(undefined);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        next();
    };

    // Helper to render the selected icon
    const SelectedIconComponent = ICON_MAP[selectedIcon] || Building2;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">About Features</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Add key features with icons for the About section (e.g., "Developer Credibility (ADNH)")
                    </p>
                </div>

                {/* Add Feature Form */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                        <Label htmlFor="featureName">Feature Text</Label>
                        <Input
                            id="featureName"
                            value={featureName}
                            onChange={(e) => setFeatureName(e.target.value)}
                            placeholder="e.g., Developer Credibility (ADNH)"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddFeature();
                                }
                            }}
                        />
                    </div>

                    <div>
                        <Label>Icon (Select or Upload)</Label>
                        <div className="flex gap-2">
                            {/* Visual Icon Picker using DropdownMenu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between px-3"
                                        disabled={!!customIcon}
                                    >
                                        <div className="flex items-center gap-2">
                                            <SelectedIconComponent className="w-4 h-4" />
                                            <span className="truncate">{selectedIcon}</span>
                                        </div>
                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[300px] p-2" align="start">
                                    <div className="grid grid-cols-5 gap-2">
                                        {COMMON_ICONS.map((iconName) => {
                                            const Icon = ICON_MAP[iconName];
                                            return (
                                                <DropdownMenuItem
                                                    key={iconName}
                                                    className={cn(
                                                        "flex items-center justify-center h-10 w-10 p-0 cursor-pointer rounded-md focus:bg-accent focus:text-accent-foreground",
                                                        selectedIcon === iconName && "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                                                    )}
                                                    onClick={() => {
                                                        setSelectedIcon(iconName);
                                                        setCustomIcon(undefined);
                                                    }}
                                                    title={iconName}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </DropdownMenuItem>
                                            );
                                        })}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <MediaLibraryButton
                                onSelect={(media) => {
                                    setCustomIcon(media);
                                    setSelectedIcon(""); // Clear default icon if custom selected
                                }}
                                buttonText="Upload"
                                mode="select"
                            />
                        </div>
                        {customIcon && (
                            <div className="mt-2 text-xs flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-100 dark:border-blue-900">
                                <div className="flex items-center gap-2">
                                    <div className="relative w-6 h-6 rounded overflow-hidden">
                                        <Image
                                            src={customIcon.url}
                                            alt="Custom Icon"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="truncate max-w-[80px]">Custom</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                        setCustomIcon(undefined);
                                        setSelectedIcon("Building2");
                                    }}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <Button type="button" onClick={handleAddFeature} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                </Button>

                {/* Features List */}
                {store.aboutFeatures.length > 0 && (
                    <div className="space-y-2 mt-4">
                        <Label>Added Features ({store.aboutFeatures.length})</Label>
                        {store.aboutFeatures.map((feature) => {
                            // Determine which icon info to display
                            const FeatureIcon = feature.icon && ICON_MAP[feature.icon] ? ICON_MAP[feature.icon] : Building2;

                            return (
                                <div
                                    key={feature.id}
                                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded"
                                >
                                    <div className="flex items-center gap-3">
                                        {feature.customIcon ? (
                                            <div className="relative w-8 h-8 rounded overflow-hidden border border-gray-200">
                                                <Image
                                                    src={feature.customIcon.url}
                                                    alt={feature.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded flex items-center justify-center">
                                                {feature.icon && <FeatureIcon className="w-5 h-5" />}
                                                {!feature.icon && <AboutIconFallback />}
                                            </span>
                                        )}
                                        <span className="text-sm font-medium">{feature.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => store.removeAboutFeature(feature.id!)}
                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
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

function AboutIconFallback() {
    return <Building2 className="w-5 h-5" />;
}
