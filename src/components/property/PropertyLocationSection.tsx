"use client";

import dynamic from "next/dynamic";
import { useMemo, useEffect } from "react";

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

interface PropertyLocationSectionProps {
    title: string;
    location: string;
    latitude?: number | null;
    longitude?: number | null;
}

export function PropertyLocationSection({
    title,
    location,
    latitude,
    longitude,
}: PropertyLocationSectionProps) {
    // Fix Leaflet marker icon issue
    useEffect(() => {
        const fixLeafletIcon = async () => {
            try {
                const L = (await import("leaflet")).default;
                // @ts-ignore
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                });
            } catch (e) {
                console.error("Failed to fix Leaflet icon", e);
            }
        };
        fixLeafletIcon();
    }, []);

    // Default to Dubai coordinates if not provided
    const position = useMemo<[number, number]>(() => {
        return [latitude || 25.2048, longitude || 55.2708];
    }, [latitude, longitude]);

    return (
        <div className="w-full h-full">
            <h2 className="text-xl font-bold mb-4">Location</h2>

            <div className="h-[400px] rounded-xl overflow-hidden shadow-sm border relative z-0">
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
                                <strong>{title}</strong>
                                <br />
                                {location}
                            </Popup>
                        </Marker>
                    </MapContainer>
                )}
            </div>
        </div>
    );
}
