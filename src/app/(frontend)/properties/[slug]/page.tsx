import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getMediaUrl } from "@/lib/utils";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Check,
  User,
  Phone,
  Mail,
  Home,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[400px] md:h-[500px]">
          <div className="md:col-span-2 h-full relative rounded-xl overflow-hidden bg-muted group">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt || property.title}
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
          <div className="md:col-span-2 grid grid-cols-2 gap-4 h-full">
            {otherImages.map((image, index) => (
              <div
                key={image.id}
                className="relative rounded-xl overflow-hidden bg-muted group"
              >
                <Image
                  src={image.url}
                  alt={image.alt || property.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
            {/* Placeholder for remaining slots if fewer than 4 other images */}
            {Array.from({ length: Math.max(0, 4 - otherImages.length) }).map(
              (_, i) => (
                <div
                  key={`placeholder-${i}`}
                  className="bg-muted rounded-xl flex items-center justify-center text-muted-foreground/20"
                >
                  <Home className="w-8 h-8" />
                </div>
              )
            )}
          </div>
        </div>

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

            {/* Map Placeholder */}
            <section>
              <h2 className="text-xl font-bold mb-4">Location</h2>
              <div className="bg-muted rounded-xl h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Map View Unavailable</p>
                  <p className="text-sm opacity-75">
                    {property.latitude && property.longitude
                      ? `Lat: ${property.latitude}, Long: ${property.longitude}`
                      : "Coordinates not provided"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-muted overflow-hidden relative">
                    {property.createdBy.image ? (
                      <Image
                        src={property.createdBy.image}
                        alt={property.createdBy.name || "Agent"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {property.createdBy.name || "Estate Agent"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Listing Agent
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Agent
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Agent
                  </Button>
                </div>
              </CardContent>
            </Card>

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
    </div>
  );
}
