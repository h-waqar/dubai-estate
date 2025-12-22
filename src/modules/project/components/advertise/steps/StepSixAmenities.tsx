"use client";

import React from "react";
import { useProjectAdvertiseStore } from "../../../stores/useProjectAdvertiseStore";
import { useProjectStepStore } from "../../../stores/useProjectStepStore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import MediaLibraryButton from "@/modules/media/components/MediaLibraryButton";
import Image from "next/image";
import { X } from "lucide-react";

export default function StepSixAmenities({ amenities }: { amenities: any[] }) {
    const store = useProjectAdvertiseStore();
    const { next, prev } = useProjectStepStore();

    const toggleAmenity = (amenity: any) => {
        store.toggleAmenity({
            id: amenity.id,
            name: amenity.name,
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.length > 0 ? (
                        amenities.map((amenity) => {
                            const selected = store.selectedAmenities.find(a => a.id === amenity.id);
                            return (
                                <div key={amenity.id} className="border border-gray-100 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Checkbox
                                            id={`amenity-${amenity.id}`}
                                            checked={!!selected}
                                            onCheckedChange={() => toggleAmenity(amenity)}
                                        />
                                        <Label
                                            htmlFor={`amenity-${amenity.id}`}
                                            className="text-sm cursor-pointer font-medium"
                                        >
                                            {amenity.name}
                                        </Label>
                                    </div>

                                    {selected && (
                                        <div className="pl-6 mt-2">
                                            <div className="flex items-center gap-3">
                                                {selected.image ? (
                                                    <div className="relative w-12 h-12 rounded overflow-hidden border border-gray-200">
                                                        <Image
                                                            src={selected.image.url}
                                                            alt={selected.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => store.updateAmenityImage(amenity.id, undefined as any)}
                                                            className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-bl text-[8px]"
                                                        >
                                                            <X className="w-2 h-2" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <MediaLibraryButton
                                                        onSelect={(media) => store.updateAmenityImage(amenity.id, media)}
                                                        buttonText="Add Image"
                                                        mode="select"
                                                    />
                                                )}
                                                {selected.image && (
                                                    <span className="text-xs text-green-600 dark:text-green-400">Image Added</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
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
