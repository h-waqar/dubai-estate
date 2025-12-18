"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const developers = [
    { name: "DAMAC Properties", logo: "/developers/damac-properties-dubai.png" },
    { name: "Dubai Properties", logo: "/developers/dubai-properties.png" },
    { name: "Ellington Properties", logo: "/developers/ellinton-properties.png" },
    { name: "Emaar Properties", logo: "/developers/emaar-properties-dubai.png" },
    { name: "Meraas Properties", logo: "/developers/meeras-properties.png" },
    { name: "Nakheel Properties", logo: "/developers/nakheel-properties.png" },
    { name: "Nshama", logo: "/developers/nshama.png" },
];

export function DevelopersCarousel() {
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Inject keyframes animation
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            @keyframes scroll-carousel {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-50%);
                }
            }
        `;
        document.head.appendChild(styleSheet);

        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    return (
        <section className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-light mb-4">
                        Our <span className="font-semibold">Partners</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Collaborating with Dubai&apos;s most prestigious developers
                    </p>
                </motion.div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Gradient overlays for smooth edges */}
                    {/* <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" /> */}

                    {/* Scrolling Container */}
                    <div className="overflow-hidden">
                        <motion.div
                            ref={trackRef}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-8 items-center"
                            style={{
                                animation: "scroll-carousel 30s linear infinite",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.animationPlayState = "paused";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.animationPlayState = "running";
                            }}
                        >
                            {/* Original set */}
                            {developers.map((dev, index) => (
                                <div
                                    key={`original-${index}`}
                                    className="flex-shrink-0 w-64 h-32 bg-black dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                                >
                                    <div className="relative w-full h-full scale-200">
                                        <Image
                                            src={dev.logo}
                                            alt={dev.name}
                                            fill
                                            className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            ))}
                            {/* Duplicate set for seamless loop */}
                            {developers.map((dev, index) => (
                                <div
                                    key={`duplicate-${index}`}
                                    className="flex-shrink-0 w-64 h-32 bg-black dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                                >
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={dev.logo}
                                            alt={dev.name}
                                            fill
                                            className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
