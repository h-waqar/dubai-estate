"use client";

import { useState } from "react";
import Image from "next/image";

interface Feature {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    imageUrl: string | null;
    category: string;
}

interface FeaturesAmenitiesSectionProps {
    features: Feature[];
}

export function FeaturesAmenitiesSection({ features }: FeaturesAmenitiesSectionProps) {
    const amenities = features.filter(f => f.category === "AMENITY");
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (amenities.length === 0) return null;

    const selectedAmenity = amenities[selectedIndex];

    return (
        <section id="features-amenities" className="py-16 md:py-24 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                    Features & Amenities
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
                    Experience the finest in maritime living with world-class facilities designed for relaxation, wellness, and entertainment.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Amenities List - Left Column */}
                    <div className="space-y-3">
                        {amenities.map((amenity, index) => (
                            <button
                                key={amenity.id}
                                onClick={() => setSelectedIndex(index)}
                                className={`
                                    w-full text-left px-6 py-4 rounded-lg transition-all flex items-center gap-4
                                    ${selectedIndex === index
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }
                                `}
                            >
                                <span className={`
                                    text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full
                                    ${selectedIndex === index ? "bg-white/20" : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"}
                                `}>
                                    {index + 1}
                                </span>
                                <span className="font-medium flex-1">{amenity.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Image Viewer - Right Column */}
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl">
                        {selectedAmenity?.imageUrl ? (
                            <>
                                <Image
                                    src={selectedAmenity.imageUrl}
                                    alt={selectedAmenity.name}
                                    fill
                                    className="object-cover transition-opacity duration-300"
                                    key={selectedAmenity.id}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                {/* Overlay with amenity name */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <h3 className="text-white text-2xl font-bold mb-2">
                                        {selectedAmenity.name}
                                    </h3>
                                    {selectedAmenity.description && (
                                        <p className="text-white/90 text-sm">
                                            {selectedAmenity.description}
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                <div className="text-6xl mb-4">📷</div>
                                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                                    {selectedAmenity.name}
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                                    No image available
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
