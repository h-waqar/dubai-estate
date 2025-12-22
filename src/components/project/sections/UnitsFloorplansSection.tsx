"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Phone } from "lucide-react";

interface Floorplan {
    id: number;
    unitType: string;
    unitName: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    size: number | null;
    sizeUnit: string | null;
    imageUrl: string | null;
    pdfUrl: string | null;
}

interface UnitsFloorplansSectionProps {
    floorplans: Floorplan[];
}

export function UnitsFloorplansSection({ floorplans }: UnitsFloorplansSectionProps) {
    // Group floorplans by unitType
    const groupedFloorplans = floorplans.reduce((acc, fp) => {
        if (!acc[fp.unitType]) {
            acc[fp.unitType] = [];
        }
        acc[fp.unitType].push(fp);
        return acc;
    }, {} as Record<string, Floorplan[]>);

    const unitTypes = Object.keys(groupedFloorplans);
    const [selectedType, setSelectedType] = useState(unitTypes[0] || "");

    if (floorplans.length === 0) return null;

    const selectedFloorplan = groupedFloorplans[selectedType]?.[0];

    // Format unit type for display
    const formatUnitType = (type: string) => {
        return type.split("_").map(word =>
            word.charAt(0) + word.slice(1).toLowerCase()
        ).join(" ");
    };

    return (
        <section id="units-floorplans" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                    Units & Floorplans
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                    Choose from a selection of units and floor plans
                </p>

                {/* Toggle Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {unitTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`
                                px-6 py-3 rounded-lg font-medium transition-all
                                ${selectedType === type
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }
                            `}
                        >
                            {formatUnitType(type)}
                        </button>
                    ))}
                </div>

                {/* Selected Floorplan Display */}
                {selectedFloorplan && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 md:p-8 shadow-lg">
                            <h3 className="text-2xl font-semibold mb-6">
                                {selectedFloorplan.unitName || formatUnitType(selectedFloorplan.unitType)}
                            </h3>

                            {/* Floorplan Image */}
                            {selectedFloorplan.imageUrl && (
                                <div className="relative aspect-video mb-6 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    <Image
                                        src={selectedFloorplan.imageUrl}
                                        alt={selectedFloorplan.unitName || "Floorplan"}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}

                            {/* Unit Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {selectedFloorplan.bedrooms !== null && (
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bedrooms</p>
                                        <p className="text-2xl font-bold">{selectedFloorplan.bedrooms}</p>
                                    </div>
                                )}
                                {selectedFloorplan.bathrooms !== null && (
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bathrooms</p>
                                        <p className="text-2xl font-bold">{selectedFloorplan.bathrooms}</p>
                                    </div>
                                )}
                                {selectedFloorplan.size !== null && (
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg col-span-2">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Size</p>
                                        <p className="text-2xl font-bold">
                                            {selectedFloorplan.size} {selectedFloorplan.sizeUnit}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button className="flex-1 gap-2" size="lg">
                                    <Phone className="w-5 h-5" />
                                    Contact Sales For Availability
                                </Button>
                                {selectedFloorplan.pdfUrl && (
                                    <Button variant="outline" className="flex-1 gap-2" size="lg" asChild>
                                        <a href={selectedFloorplan.pdfUrl} download>
                                            <Download className="w-5 h-5" />
                                            Download FloorPlan
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
