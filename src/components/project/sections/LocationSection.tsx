"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
);

interface ProgressMilestone {
    id: number;
    milestone: string;
    date: string;
    order: number;
}

interface NearbyAttraction {
    id: number;
    name: string;
    distance: string;
}

interface LocationSectionProps {
    projectName: string;
    location: string;
    latitude?: number | null;
    longitude?: number | null;
    progressTimeline: ProgressMilestone[];
    nearbyAttractions: NearbyAttraction[];
}

export function LocationSection({
    projectName,
    location,
    latitude,
    longitude,
    progressTimeline,
    nearbyAttractions,
}: LocationSectionProps) {
    // Default to Dubai coordinates if not provided
    const position = useMemo<[number, number]>(() => {
        return [latitude || 25.2048, longitude || 55.2708];
    }, [latitude, longitude]);

    return (
        <section id="location" className="py-16 md:py-24 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4">
                {/* Project Progress */}
                {progressTimeline.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                            Project Progress
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {progressTimeline.map((milestone) => (
                                <div
                                    key={milestone.id}
                                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center"
                                >
                                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                                        {milestone.milestone}
                                    </h3>
                                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                                        {milestone.date}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Map and Nearby Attractions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Map */}
                    <div className="lg:col-span-2">
                        <div className="h-96 rounded-lg overflow-hidden shadow-lg relative">
                            {typeof window !== "undefined" && (
                                <MapContainer
                                    center={position}
                                    zoom={13}
                                    scrollWheelZoom={false}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    />
                                    <Marker position={position}>
                                        <Popup>
                                            <strong>{projectName}</strong>
                                            <br />
                                            {location}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            )}
                        </div>
                    </div>

                    {/* Nearby Attractions */}
                    {nearbyAttractions.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">Nearby Attractions</h3>
                            <div className="space-y-3">
                                {nearbyAttractions.map((attraction) => (
                                    <div
                                        key={attraction.id}
                                        className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                                    >
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {attraction.name}
                                        </span>
                                        <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                                            {attraction.distance}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
