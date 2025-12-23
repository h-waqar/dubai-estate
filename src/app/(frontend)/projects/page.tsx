"use server";

import { ProjectService } from "@/modules/project/services/project.service";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function ProjectsPage() {
    const projectsRaw = await ProjectService.listProjects({ published: true });

    // Map projects to include image URL
    const projects = projectsRaw.map((project: any) => {
        // Find cover image from mediaUsages
        const coverMedia = project.mediaUsages?.find((mu: any) => mu.role === "COVER");
        let imageUrl = coverMedia?.media?.url;

        // Process URL to ensure correct path
        const finalImage = imageUrl
            ? (imageUrl.startsWith("http") || imageUrl.startsWith("/")
                ? imageUrl
                : `/uploads/${encodeURIComponent(imageUrl)}`)
            : "/assets/nopropertyfound.jpg";

        return {
            ...project,
            imageUrl: finalImage,
        };
    });

    return (
        <div className="min-h-screen">
            <Header />

            <div className="mx-auto py-12">
                {/* <div className="mx-auto px-4 py-12"> */}
                {/* <div className="container mx-auto px-4 py-12"> */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
                    <p className="text-xl text-muted-foreground">
                        Explore our exclusive development projects
                    </p>
                </div>

                {/* Projects List */}
                {/* <div className="space-y-8"> */}
                <div className="">
                    {projects.map((project: any) => (
                        <Link
                            key={project.id}
                            href={`/projects/${project.slug}`}
                            className="group block relative overflow-hidden"
                            style={{ height: '600px' }}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={project.imageUrl}
                                    alt={project.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Overlay gradient for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            </div>

                            {/* Content - Bottom Left with Glassmorphism */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <div className="max-w-2xl">
                                    {/* Project Name - Glassmorphic Box */}
                                    <div className="inline-block mb-4 px-6 py-3 rounded-lg bg-black/70 backdrop-blur-md border border-white/10">
                                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                                            {project.name}
                                        </h2>
                                    </div>

                                    {/* Description */}
                                    {project.description && (
                                        <p className="text-lg md:text-xl text-white/90 mb-3 line-clamp-1 font-medium">
                                            {project.description}
                                        </p>
                                    )}

                                    {/* Location */}
                                    <div className="flex items-center text-white/80 text-base md:text-lg">
                                        <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <span>{project.location}</span>
                                    </div>

                                    {/* Additional Info (optional) */}
                                    {project.priceFrom && (
                                        <div className="mt-4 inline-block px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                                            <span className="text-white font-semibold text-lg">
                                                From AED {project.priceFrom.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Badge - Top Right */}
                            <div className="absolute top-6 px-4 flex justify-end gap-2">
                                {/* <div className="absolute top-6 right-6 flex flex-col gap-2 items-end"> */}
                                {project.isFeatured && (
                                    <div className="px-4 py-2 rounded-full bg-primary/90 backdrop-blur-md border border-primary/30 text-white font-semibold text-sm">
                                        Featured
                                    </div>
                                )}
                                <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-sm">
                                    {project.projectType}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No projects available</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
