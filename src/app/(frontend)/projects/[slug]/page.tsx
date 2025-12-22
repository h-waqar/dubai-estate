"use server";

import { ProjectService } from "@/modules/project/services/project.service";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Building2, MapPin } from "lucide-react";
import { ProjectHeroSlider } from "@/components/project/ProjectHeroSlider";
import { ProjectHeroOverlay } from "@/components/project/ProjectHeroOverlay";
import { ProjectNavigation } from "@/components/project/ProjectNavigation";
import { AboutSection } from "@/components/project/sections/AboutSection";
import { GallerySlider } from "@/components/project/GallerySlider";
import { UnitsFloorplansSection } from "@/components/project/sections/UnitsFloorplansSection";
import { FeaturesAmenitiesSection } from "@/components/project/sections/FeaturesAmenitiesSection";
import { PaymentPlanSection } from "@/components/project/sections/PaymentPlanSection";
import { LocationSection } from "@/components/project/sections/LocationSection";
import { ProjectProgressSection } from "@/components/project/sections/ProjectProgressSection";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = await ProjectService.getProjectBySlug(slug);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    // Fetch cover image for Open Graph
    const mediaUsages = await prisma.mediaUsage.findMany({
        where: {
            entityType: "PROJECT",
            entityId: project.id,
            role: "COVER",
        },
        include: { media: true },
        take: 1,
    });

    const coverImage = mediaUsages[0]?.media;
    const description = project.description?.slice(0, 160) || `${project.name} - Luxury real estate project in ${project.location}`;
    const imageUrl = coverImage?.url ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${coverImage.url}` : undefined;

    return {
        title: `${project.name} | Dubai Real Estate Projects`,
        description,
        keywords: [
            project.name,
            project.location,
            project.community || '',
            project.developer.name,
            'Dubai Real Estate',
            'Property Development',
            'Luxury Apartments',
        ].filter(Boolean),
        openGraph: {
            title: project.name,
            description,
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
            type: 'website',
            siteName: 'Dubai Real Estate',
        },
        twitter: {
            card: 'summary_large_image',
            title: project.name,
            description,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}

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

    // Generate JSON-LD structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "RealEstateProject",
        name: project.name,
        description: project.description,
        address: {
            "@type": "PostalAddress",
            addressLocality: project.location,
            addressCountry: "AE",
        },
        ...(project.priceFrom && {
            offers: {
                "@type": "Offer",
                price: project.priceFrom.toString(),
                priceCurrency: project.currency,
            },
        }),
        ...(project.latitude && project.longitude && {
            geo: {
                "@type": "GeoCoordinates",
                latitude: project.latitude,
                longitude: project.longitude,
            },
        }),
        developer: {
            "@type": "Organization",
            name: project.developer.name,
        },
        ...(project.handoverDate && {
            expectedCompletionDate: project.handoverDate,
        }),
    };

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

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

                {/* Navigation */}
                <ProjectNavigation />

                {/* About Section */}
                <AboutSection
                    tagline={project.tagline}
                    aboutContent={project.aboutContent || project.description}
                    features={project.features?.filter(f => f.category === "ABOUT_FEATURE").map(f => ({
                        name: f.name,
                        icon: f.icon || undefined,
                        imageUrl: f.imageUrl || undefined
                    })) || []}
                    randomGalleryImage={gallery[0] || null}
                />

                {/* Gallery Slider */}
                {gallery.length > 0 && (
                    <GallerySlider images={gallery} />
                )}

                {/* Units & Floorplans Section */}
                <UnitsFloorplansSection floorplans={project.floorplans} />

                {/* Features & Amenities Section */}
                <FeaturesAmenitiesSection features={project.features || []} />

                {/* 6. Payment Plan */}
                <PaymentPlanSection
                    paymentPlan={project.paymentPlan}
                    locationDescription={project.locationDescription}
                />

                {/* 7. Project Progress */}
                <ProjectProgressSection
                    percentage={project.progressPercentage || 0}
                    status={project.progressStatus || ""}
                    image={project.progressImage || undefined}
                    constructionDate={project.constructionStartDate || undefined}
                    handoverDate={project.handoverDate || undefined}
                />

                {/* 8. Location */}
                <LocationSection
                    projectName={project.name}
                    location={project.location}
                    latitude={project.latitude}
                    longitude={project.longitude}
                    progressTimeline={project.progressTimeline}
                    nearbyAttractions={project.nearbyAttractions}
                />
            </div>
        </>
    );
}

