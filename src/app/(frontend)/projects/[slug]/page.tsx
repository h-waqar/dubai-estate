"use server";

import { ProjectService } from "@/modules/project/services/project.service";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Building2, MapPin } from "lucide-react";
import { ProjectHeroSlider } from "@/components/project/ProjectHeroSlider";
import { ProjectHeroOverlay } from "@/components/project/ProjectHeroOverlay";

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

    const logo = mediaUsages.find(mu => mu.role === "LOGO")?.media;
    const coverImage = mediaUsages.find(mu => mu.role === "COVER")?.media;
    const gallery = mediaUsages.filter(mu => mu.role === "GALLERY").map(mu => mu.media);

    // Combine cover image and gallery for slider
    const sliderImages = [
        ...(coverImage ? [coverImage] : []),
        ...gallery,
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero Slider with Overlay */}
            <div className="relative">
                <ProjectHeroSlider images={sliderImages} />
                <ProjectHeroOverlay
                    logo={logo}
                    projectName={project.name}
                    description={project.description}
                    priceFrom={project.priceFrom}
                    paymentPlanSummary={project.paymentPlanSummary}
                    handoverDate={project.handoverDate}
                />
            </div>

            {/* Content Below Hero */}
            <div className="container mx-auto px-4 py-12">
                {/* Project Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Developer & Location Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                            <p className="text-xl text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-3">
                                <Building2 className="w-5 h-5" />
                                Developed by {project.developer.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                {project.location}
                            </p>
                            <div className="mt-4">
                                <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                                    {project.projectType}
                                </span>
                            </div>
                        </div>

                        {/* Full Description */}
                        {project.description && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                        )}

                        {/* Amenities */}
                        {project.amenities.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {project.amenities.map((amenity) => (
                                        <div key={amenity.id} className="flex items-center gap-2">
                                            <span className="text-green-600 text-lg">✓</span>
                                            <span>{amenity.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Plan Details */}
                        {project.paymentPlan.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                <h2 className="text-2xl font-semibold mb-4">Payment Plan Breakdown</h2>
                                <div className="space-y-3">
                                    {project.paymentPlan.map((stage) => (
                                        <div key={stage.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                            <span className="text-gray-700 dark:text-gray-300">{stage.description}</span>
                                            <span className="font-semibold text-lg text-blue-600">{stage.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Floorplans */}
                        {project.floorplans.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                <h2 className="text-2xl font-semibold mb-4">Available Floor Plans</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.floorplans.map((floorplan) => (
                                        <div key={floorplan.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
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
                        {/* Nearby Attractions */}
                        {project.nearbyAttractions.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">Nearby Attractions</h3>
                                <div className="space-y-3">
                                    {project.nearbyAttractions.map((attraction) => (
                                        <div key={attraction.id} className="flex justify-between text-sm pb-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                            <span className="text-gray-700 dark:text-gray-300">{attraction.name}</span>
                                            <span className="text-gray-600 dark:text-gray-400 font-medium">{attraction.distance}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
