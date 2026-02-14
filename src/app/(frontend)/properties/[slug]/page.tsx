import React from "react";
import { notFound } from "next/navigation";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getMediaUrl } from "@/lib/utils";
import { GovernanceService } from "@/modules/governance/governance.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Check,
  Home,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ImageGallery } from "@/components/properties/ImageGallery";
import { PropertyLocationSection } from "@/components/property/PropertyLocationSection";
import { AgentCard } from "@/components/property/AgentCard";
import { ViewCounter } from "@/modules/property/components/ViewCounter";

// Helper to format currency
const formatCurrency = (amount: number, currency: string = "AED") => {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper to format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });

  if (!property) {
    return {
      title: "Property Not Found",
    };
  }

  return {
    title: `${property.title} | Dubai Estate`,
    description: property.description?.slice(0, 160) || "Property details",
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;

  const property = await prisma.property.findUnique({
    where: { slug },
    include: {
      propertyType: true,
      images: true, // Include legacy images
      features: {
        include: {
          feature: true,
        },
      },
      // mediaUsages relation might be empty if propertyId is not set, so we fetch manually below
      createdBy: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!property) {
    notFound();
  }

  // Security Check: Using Tri-State Governance
  const isVisible = GovernanceService.isVisible(property);

  if (!isVisible) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    const isAdmin = user?.roles?.includes("ADMIN") || user?.roles?.includes("MANAGER");
    const isOwner = user?.id === property.createdById;

    if (!isAdmin && !isOwner) {
      notFound(); // Hide existence from unauthorized users
    }
  }

  // Manually fetch media usages to ensure we get them even if the relation is broken
  const mediaUsages = await prisma.mediaUsage.findMany({
    where: {
      entityType: "PROPERTY",
      entityId: property.id,
    },
    include: {
      media: true,
    },
  });


  // Combine images from both sources
  // 1. Legacy PropertyImage table
  const legacyImages = property.images.map((img) => ({
    id: img.id,
    url: getMediaUrl(img.url),
    alt: img.alt || property.title,
  }));

  // 2. MediaUsage table
  const mediaImages = mediaUsages
    .map((usage) => usage.media)
    .filter((media) => media.type === "IMAGE")
    .map((img) => ({
      id: img.id,
      url: getMediaUrl(img.url),
      alt: img.alt || property.title,
    }));

  // Merge and deduplicate (prefer MediaUsage if available, or just concat)
  // If we have mediaImages, they are likely newer/better.
  // But let's show all unique images.
  const allImages = [...mediaImages, ...legacyImages];

  // Deduplicate by URL just in case
  const uniqueImages = Array.from(
    new Map(allImages.map((img) => [img.url, img])).values()
  );

  const mainImage = uniqueImages.length > 0 ? uniqueImages[0] : null;
  const otherImages = uniqueImages.length > 1 ? uniqueImages.slice(1, 5) : [];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/properties" className="hover:text-primary">
              Properties
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">
              {property.title}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-primary border-primary">
                {property.propertyType.name}
              </Badge>
              <Badge
                variant={
                  property.status === "APPROVED" ? "default" : "secondary"
                }
              >
                {property.status}
              </Badge>
              <Badge variant="secondary">{property.availability}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {property.title}
            </h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              {property.address || property.location}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(Number(property.price), property.currency)}
            </div>
            <div className="text-sm text-muted-foreground">
              Ref: {property.refNo || "N/A"}
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <ImageGallery images={uniqueImages} title={property.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Features */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-card rounded-xl border shadow-sm">
              <div className="flex flex-col items-center justify-center text-center p-2">
                <Bed className="w-6 h-6 text-primary mb-2" />
                <span className="font-bold text-lg">
                  {property.bedrooms || 0}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Bedrooms
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-2 border-l border-r">
                <Bath className="w-6 h-6 text-primary mb-2" />
                <span className="font-bold text-lg">
                  {property.bathrooms || 0}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Bathrooms
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-2">
                <Maximize className="w-6 h-6 text-primary mb-2" />
                <span className="font-bold text-lg">
                  {property.builtUpArea || 0}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {property.areaUnit}
                </span>
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <div className="prose max-w-none text-muted-foreground whitespace-pre-line">
                {property.description || "No description provided."}
              </div>
            </section>

            <Separator />

            {/* Amenities / Features */}
            <section>
              <h2 className="text-xl font-bold mb-4">Features & Amenities</h2>
              {property.features.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map(({ feature }) => (
                    <div
                      key={feature.id}
                      className="flex items-center text-muted-foreground"
                    >
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      <span>{feature.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No specific features listed.
                </p>
              )}
            </section>

            <Separator />

            {/* Location Map */}
            <PropertyLocationSection
              title={property.title}
              location={property.address || property.location}
              latitude={property.latitude}
              longitude={property.longitude}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <AgentCard
              name={property.createdBy.name}
              image={property.createdBy.image}
              email={property.createdBy.email}
              phone={property.createdBy.phoneNumber}
              propertyRef={property.refNo}
              propertySlug={property.slug}
            />

            {/* Quick Summary */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-lg mb-2">Property Summary</h3>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">
                    {property.propertyType.name}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Purpose</span>
                  <span className="font-medium">For Sale</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-medium">{property.refNo || "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Added On</span>
                  <span className="font-medium">
                    {formatDate(property.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Furnishing</span>
                  <span className="font-medium capitalize">
                    {property.furnishing.toLowerCase().replace("_", " ")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ViewCounter propertyId={property.id} />
    </div>
  );
}
