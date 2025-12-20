"use server";

import { ProjectService } from "@/modules/project/services/project.service";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Building2, ArrowLeft } from "lucide-react";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await ProjectService.getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    // Fetch media for this project
    const mediaUsages = await prisma.mediaUsage.findMany({
        where: {
            entityType: "PROJECT",
            entityId: project.id,
        },
        include: {
            media: true,
        },
    });

    const coverImage = mediaUsages.find(mu => mu.role === "COVER")?.media;
    const gallery = mediaUsages.filter(mu => mu.role === "GALLERY").map(mu => mu.media);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Link href="/projects">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Projects
                    </Button>
                </Link>

                {/* Cover Image */}
                {coverImage && (
                    <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                        <Image
                            src={coverImage.url}
                            alt={project.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                {/* Project Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                by {project.developer.name}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {project.location}
                            </span>
                            {project.handoverDate && (
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Handover: {new Date(project.handoverDate).toLocaleDateString()}
                                </span>
                            )}
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                {project.projectType}
                            </span>
                        </div>

                        {project.description && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">About</h2>
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                    {project.description}
                                </p>
                            </div>
                        )}

                        {/* Amenities */}
                        {project.amenities.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {project.amenities.map((amenity) => (
                                        <div key={amenity.id} className="flex items-center gap-2">
                                            <span className="text-green-600">✓</span>
                                            <span>{amenity.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Plan */}
                        {project.paymentPlan.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Payment Plan</h2>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                                    {project.paymentPlan.map((stage) => (
                                        <div key={stage.id} className="flex justify-between">
                                            <span>{stage.description}</span>
                                            <span className="font-semibold">{stage.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Floorplans */}
                        {project.floorplans.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Floor Plans</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.floorplans.map((floorplan) => (
                                        <div key={floorplan.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                                            <h3 className="font-semibold text-lg mb-2">{floorplan.unitName}</h3>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                <p>{floorplan.bedrooms} Bed | {floorplan.bathrooms} Bath</p>
                                                <p>{floorplan.size} {floorplan.sizeUnit}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Price */}
                        {project.priceFrom && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Starting from</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    AED {project.priceFrom.toLocaleString()}
                                </p>
                                {project.paymentPlanSummary && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        Payment Plan: {project.paymentPlanSummary}
                                    </p>
                                )}
                                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                                    Contact Developer
                                </Button>
                            </div>
                        )}

                        {/* Nearby Attractions */}
                        {project.nearbyAttractions.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">Nearby</h3>
                                <div className="space-y-2">
                                    {project.nearbyAttractions.map((attraction) => (
                                        <div key={attraction.id} className="flex justify-between text-sm">
                                            <span>{attraction.name}</span>
                                            <span className="text-gray-600 dark:text-gray-400">{attraction.distance}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Gallery */}
                {gallery.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {gallery.map((image) => (
                                <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden">
                                    <Image
                                        src={image.url}
                                        alt={image.title || project.name}
                                        fill
                                        className="object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
