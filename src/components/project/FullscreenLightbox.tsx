"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Media {
    id: number;
    url: string;
    title: string | null;
}

interface FullscreenLightboxProps {
    images: Media[];
    initialIndex: number;
    onClose: () => void;
}

export function FullscreenLightbox({ images, initialIndex, onClose }: FullscreenLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") handlePrevious();
        if (e.key === "ArrowRight") handleNext();
    };

    // Add keyboard event listener
    useState(() => {
        window.addEventListener("keydown", handleKeyDown as any);
        return () => window.removeEventListener("keydown", handleKeyDown as any);
    });

    const currentImage = images[currentIndex];

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
            >
                <X className="w-8 h-8" />
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Previous image"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
                <div className="relative max-w-7xl max-h-full w-full h-full">
                    <Image
                        src={currentImage.url}
                        alt={currentImage.title || "Gallery image"}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                    />
                </div>
            </div>

            {/* Next Button */}
            {images.length > 1 && (
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Next image"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
}
