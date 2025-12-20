"use client";

import React from "react";
import { useProjectAdvertiseStore } from "../../../stores/useProjectAdvertiseStore";
import { useProjectStepStore } from "../../../stores/useProjectStepStore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function StepSixAmenities({ amenities }: { amenities: any[] }) {
    const store = useProjectAdvertiseStore();
    const { next, prev } = useProjectStepStore();

    const toggleAmenity = (amenityId: number) => {
        const current = store.selectedAmenities;
        if (current.includes(amenityId)) {
            store.update({
                selectedAmenities: current.filter((id) => id !== amenityId),
            });
        } else {
            store.update({
                selectedAmenities: [...current, amenityId],
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.length > 0 ? (
                        amenities.map((amenity) => (
                            <div key={amenity.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`amenity-${amenity.id}`}
                                    checked={store.selectedAmenities.includes(amenity.id)}
                                    onCheckedChange={() => toggleAmenity(amenity.id)}
                                />
                                <Label
                                    htmlFor={`amenity-${amenity.id}`}
                                    className="text-sm cursor-pointer"
                                >
                                    {amenity.name}
                                </Label>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 py-8">
                            No amenities available. Admin will add amenities first.
                        </p>
                    )}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                    Selected: {store.selectedAmenities.length} amenities
                </p>
            </div>

            <div className="flex justify-between">
                <Button onClick={prev} variant="outline">
                    Back
                </Button>
                <Button onClick={() => next()}>Next: Account</Button>
            </div>
        </div>
    );
}
