"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullscreenLightbox } from "./FullscreenLightbox";

interface Media {
    id: number;
    url: string;
    title: string | null;
}

interface GallerySliderProps {
    images: Media[];
}

export function GallerySlider({ images }: GallerySliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    if (images.length === 0) return null;

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? Math.max(0, images.length - 2) : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev >= images.length - 2 ? 0 : prev + 1));
    };

    const openLightbox = (index: number) => {
        setLightboxIndex(currentIndex + index);
        setLightboxOpen(true);
    };

    // Show 2 images at a time
    const visibleImages = images.slice(currentIndex, currentIndex + 2);

    return (
        <>
            <div className="py-12 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4">
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">Gallery</h3>

                    <div className="relative max-w-6xl mx-auto">
                        {/* Images */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {visibleImages.map((image, idx) => (
                                <div
                                    key={image.id}
                                    className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 group cursor-pointer"
                                    onClick={() => openLightbox(idx)}
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.title || `Gallery image ${currentIndex + idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    {/* Fullscreen Icon Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                        <Maximize2 className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        {images.length > 2 && (
                            <>
                                <button
                                    onClick={handlePrevious}
                                    className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Previous images"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Next images"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Fullscreen Lightbox */}
            {lightboxOpen && (
                <FullscreenLightbox
                    images={images}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </>
    );
}
