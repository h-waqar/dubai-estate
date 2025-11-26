"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight, Maximize2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";

interface PropertyImage {
  id: number;
  url: string;
  alt?: string | null;
}

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const processedImages = images.map((img) => ({
    ...img,
    url: getMediaUrl(img.url),
  }));

  const mainImage = processedImages[0];
  const smallImages = processedImages.slice(1, 5);
  const remainingCount = Math.max(0, processedImages.length - 5);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) =>
        prev === null ? null : (prev + 1) % processedImages.length
      );
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) =>
        prev === null
          ? null
          : (prev - 1 + processedImages.length) % processedImages.length
      );
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  if (processedImages.length === 0) {
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Home className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[400px] md:h-[500px]">
        {/* Main Image */}
        <div
          className="md:col-span-2 h-full relative rounded-xl overflow-hidden bg-muted group cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={mainImage.url}
            alt={mainImage.alt || title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Small Images Grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4 h-full">
          {smallImages.map((image, index) => (
            <div
              key={image.id}
              className="relative rounded-xl overflow-hidden bg-muted group cursor-pointer"
              onClick={() => openLightbox(index + 1)}
            >
              <Image
                src={image.url}
                alt={image.alt || title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          ))}

          {/* Placeholders if fewer than 5 images */}
          {Array.from({ length: Math.max(0, 4 - smallImages.length) }).map(
            (_, i) => (
              <div
                key={`placeholder-${i}`}
                className="bg-muted rounded-xl flex items-center justify-center text-muted-foreground/20"
              >
                <Home className="w-8 h-8" />
              </div>
            )
          )}

          {/* Overlay for remaining images on the last visible slot */}
          {remainingCount > 0 && smallImages.length === 4 && (
            <div
              className="absolute bottom-0 right-0 top-1/2 left-1/2 md:top-auto md:left-auto md:relative w-full h-full md:w-auto md:h-auto col-start-2 row-start-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                openLightbox(4);
              }}
            >
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl z-10 backdrop-blur-[2px]">
                <span className="text-white font-bold text-xl">
                  +{remainingCount} More
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50 hidden md:flex"
              onClick={prevImage}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50 hidden md:flex"
              onClick={nextImage}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            {/* Image Container */}
            <div
              className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-full"
              >
                <Image
                  src={processedImages[lightboxIndex].url}
                  alt={processedImages[lightboxIndex].alt || title}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
              
              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 bg-black/50 px-4 py-2 rounded-full text-sm">
                {lightboxIndex + 1} / {processedImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyGallery;
