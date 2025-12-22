"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { ArrowRight } from "lucide-react";

// Types matching the Prisma include we will use
interface Project {
    id: number;
    name: string;
    slug: string;
    location: string;
    mediaUsages: {
        role: string;
        media: {
            url: string;
        };
    }[];
    developer: {
        name: string;
        logo?: string | null;
    };
}

interface FeaturedProjectGridProps {
    projects: Project[];
}

export function FeaturedProjectGrid({ projects }: FeaturedProjectGridProps) {
    if (!projects || projects.length === 0) return null;

    // Split projects: First 2 for top grid, remaining for bottom slider
    const topProjects = projects.slice(0, 2);
    const bottomProjects = projects.slice(2);

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-light mb-2">
                            Featured <span className="font-semibold">Launch</span>
                        </h2>
                        <p className="text-muted-foreground">
                            Discover the latest premium developments in Dubai
                        </p>
                    </div>
                    <Link href="/projects" className="hidden md:flex items-center gap-2 group text-sm font-medium">
                        VIEW ALL PROJECTS
                        <div className="bg-black dark:bg-white text-white dark:text-black rounded-full p-1 transition-transform group-hover:translate-x-1">
                            <ArrowRight className="w-3 h-3" />
                        </div>
                    </Link>
                </div>

                {/* Top Grid (2 Large Items) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {topProjects.map((project) => {
                        const coverImage = project.mediaUsages.find((m) => m.role === "COVER")?.media.url || "/placeholder-project.jpg";

                        return (
                            <Link href={`/projects/${project.slug}`} key={project.id} className="group relative block w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl">
                                {/* Background Image */}
                                <Image
                                    src={coverImage}
                                    alt={project.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Dark Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 md:to-transparent opacity-90 transition-opacity" />

                                {/* Developer Badge (Top Left) */}
                                <div className="absolute top-6 left-6 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-md z-10">
                                    <span className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                                        {project.developer.name}
                                    </span>
                                </div>

                                {/* Content (Bottom Left) */}
                                <div className="absolute bottom-6 left-6 right-6 z-10 transition-transform duration-500 group-hover:-translate-y-2">
                                    <h3 className="text-white text-3xl font-bold mb-1">{project.name}</h3>
                                    <p className="text-gray-300 text-sm">{project.location}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom Slider (FreeMode Swiper) */}
                {bottomProjects.length > 0 && (
                    <div className="relative">
                        <Swiper
                            spaceBetween={24}
                            slidesPerView={1.2}
                            freeMode={true}
                            grabCursor={true}
                            modules={[FreeMode]}
                            breakpoints={{
                                640: { slidesPerView: 2.2 },
                                1024: { slidesPerView: 3 },
                            }}
                            className="w-full"
                        >
                            {bottomProjects.map((project) => {
                                const coverImage = project.mediaUsages.find((m) => m.role === "COVER")?.media.url || "/placeholder-project.jpg";

                                return (
                                    <SwiperSlide key={project.id}>
                                        <Link href={`/projects/${project.slug}`} className="group relative block w-full h-[300px] overflow-hidden rounded-2xl">
                                            {/* Background Image */}
                                            <Image
                                                src={coverImage}
                                                alt={project.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />

                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                                            {/* Developer Badge */}
                                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-black dark:text-white z-10">
                                                {project.developer.name}
                                            </div>

                                            {/* Content */}
                                            <div className="absolute bottom-4 left-4 right-4 z-10">
                                                <h4 className="text-white text-xl font-bold">{project.name}</h4>
                                                <p className="text-gray-300 text-xs">{project.location}</p>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                )}
            </div>
        </section>
    );
}
