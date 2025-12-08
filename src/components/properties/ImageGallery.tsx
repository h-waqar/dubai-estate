"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Grid, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyImage {
    id: number;
    url: string;
    alt: string;
}

interface ImageGalleryProps {
    images: PropertyImage[];
    title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    const mainImage = images.length > 0 ? images[0] : null;
    const otherImages = images.length > 1 ? images.slice(1, 5) : [];
    const remainingCount = Math.max(0, images.length - 5);

    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setIsOpen(true);
    };

    const showNext = () => {
        setPhotoIndex((prev) => (prev + 1) % images.length);
    };

    const showPrev = () => {
        setPhotoIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleShowAll = () => {
        setShowAll(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[400px] md:h-[500px]">
                {/* Main Image */}
                <div className="md:col-span-2 h-full relative rounded-xl overflow-hidden bg-muted group cursor-pointer" onClick={() => openLightbox(0)}>
                    {mainImage ? (
                        <Image
                            src={mainImage.url}
                            alt={mainImage.alt || title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            priority
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No Image Available
                        </div>
                    )}
                </div>

                {/* Other Images Grid */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4 h-full relative">
                    {otherImages.map((image, index) => (
                        <div
                            key={image.id}
                            className="relative rounded-xl overflow-hidden bg-muted group cursor-pointer"
                            onClick={() => {
                                // If it's the last visible image (index 3) and there are more images, open show all
                                if (index === 3 && remainingCount > 0) {
                                    handleShowAll();
                                } else {
                                    openLightbox(index + 1);
                                }
                            }}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt || title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Overlay for the last image if there are more */}
                            {index === 3 && remainingCount > 0 && (
                                <div
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium text-lg cursor-pointer hover:bg-black/70 transition-colors"
                                >
                                    +{remainingCount} Photos
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Placeholders if fewer than 5 images */}
                    {Array.from({ length: Math.max(0, 4 - otherImages.length) }).map(
                        (_, i) => (
                            <div
                                key={`placeholder-${i}`}
                                className="bg-muted rounded-xl flex items-center justify-center text-muted-foreground/20"
                            >
                                <Image className="w-8 h-8 opacity-20" src="/placeholder.svg" alt="placeholder" width={32} height={32} />
                            </div>
                        )
                    )}

                    {/* Show All Photos Button (Floating) */}
                    {images.length > 5 && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-4 right-4 shadow-lg z-10 hidden md:flex"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleShowAll();
                            }}
                        >
                            <Grid className="w-4 h-4 mr-2" />
                            Show All Photos
                        </Button>
                    )}
                </div>
            </div>

            {/* Full Screen Grid View ("Bento" Style) */}
            <Dialog open={showAll} onOpenChange={setShowAll}>
                <DialogContent
                    className="max-w-none sm:max-w-none w-screen h-screen bg-background p-0 border-none rounded-none overflow-y-auto"
                    aria-describedby={undefined}
                    showCloseButton={false}
                >
                    <DialogTitle className="sr-only">Image Gallery</DialogTitle>

                    {/* Header */}
                    <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b">
                        <Button variant="ghost" size="icon" onClick={() => setShowAll(false)}>
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <span className="font-semibold">Image Gallery</span>
                        <div className="w-9" /> {/* Spacer for centering */}
                    </div>

                    {/* Grid */}
                    <div className="container mx-auto px-4 py-6 pb-20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
                            {images.map((image, index) => {
                                // Simple logic to create a "bento" feel:
                                // Make every 7th item span 2 columns and 2 rows (large)
                                // Make every 3rd item (that isn't 7th) span 2 columns (wide)
                                const isLarge = index % 7 === 0;
                                const isWide = !isLarge && index % 3 === 0;

                                return (
                                    <div
                                        key={image.id}
                                        className={cn(
                                            "relative rounded-xl overflow-hidden bg-muted cursor-pointer hover:opacity-95 transition-opacity",
                                            isLarge ? "sm:col-span-2 sm:row-span-2" : isWide ? "sm:col-span-2" : ""
                                        )}
                                        onClick={() => openLightbox(index)}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.alt || title}
                                            fill
                                            className="object-cover"
                                            sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : isWide ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 25vw"}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Lightbox Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent
                    className="max-w-none sm:max-w-none w-screen h-screen bg-black/95 border-none p-0 flex flex-col items-center justify-center text-white rounded-none"
                    aria-describedby={undefined}
                    showCloseButton={false}
                >
                    <DialogTitle className="sr-only">Image Gallery</DialogTitle>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-white/20 text-white z-50 transition-colors"
                    >
                        <X className="w-6 h-6" />
                        <span className="sr-only">Close</span>
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center p-4">
                        {/* Image */}
                        {images[photoIndex] && (
                            <div className="relative w-full h-full max-h-[85vh]">
                                <Image
                                    src={images[photoIndex].url}
                                    alt={images[photoIndex].alt || title}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showPrev();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showNext();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80 bg-black/50 px-3 py-1 rounded-full">
                        {photoIndex + 1} / {images.length}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
