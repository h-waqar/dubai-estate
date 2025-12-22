"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Media {
    id: number;
    url: string;
    title: string | null;
}

interface ProjectHeroSliderProps {
    images: Media[];
    autoPlayInterval?: number;
}

export function ProjectHeroSlider({ images, autoPlayInterval = 7000 }: ProjectHeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Auto-advance slides
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [images.length, autoPlayInterval]);

    const handlePrevious = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setTimeout(() => setIsTransitioning(false), 700);
    };

    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsTransitioning(false), 700);
    };

    if (images.length === 0) {
        return (
            <div className="relative w-full h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-xl">No images available</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Images */}
            <div className="relative w-full h-full">
                {images.map((image, index) => (
                    <div
                        key={`slide-${index}`}
                        className={`absolute inset-0 transition-transform duration-700 ease-in-out ${index === currentIndex
                            ? "translate-x-0 z-10"
                            : index < currentIndex
                                ? "-translate-x-full z-0"
                                : "translate-x-full z-0"
                            }`}
                    >
                        <Image
                            src={image.url}
                            alt={image.title || `Slide ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            quality={90}
                        />
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/40 z-10" />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    {/* Left Arrow */}
                    <button
                        onClick={handlePrevious}
                        disabled={isTransitioning}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 text-white hover:scale-110 transition-transform disabled:opacity-50 cursor-pointer"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-12 h-12 md:w-16 md:h-16 drop-shadow-2xl" strokeWidth={2.5} />
                    </button>


                    {/* Right Arrow */}
                    <button
                        onClick={handleNext}
                        disabled={isTransitioning}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 text-white hover:scale-110 transition-transform disabled:opacity-50 cursor-pointer"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-12 h-12 md:w-16 md:h-16 drop-shadow-2xl" strokeWidth={2.5} />
                    </button>
                </>
            )}

            {/* Slide Indicators */}
            {images.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (!isTransitioning) {
                                    setIsTransitioning(true);
                                    setCurrentIndex(index);
                                    setTimeout(() => setIsTransitioning(false), 500);
                                }
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                ? "bg-white w-8"
                                : "bg-white/50 hover:bg-white/75"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
