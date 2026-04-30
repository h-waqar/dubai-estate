// src\components\properties\PropertyCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PropertyCardProps } from "@/types/sections";
import { cn } from "@/lib/utils";

const PropertyCard = ({ property, priority = false }: PropertyCardProps & { priority?: boolean }) => {
  if (!property) {
    return null;
  }

  const isSpotlight = property.promotionType === "SPOTLIGHT";

  return (
    <Card className={cn(
      "property-card overflow-hidden group border-2 transition-all",
      isSpotlight ? "border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]" : "border-transparent"
    )}>
      <div className="relative">
        <Link href={`/properties/${property.slug}`}>
          <div className="overflow-hidden">
            <Image
              src={property.image}
              // CHANGE 3: Use the standardized 'alt' property
              alt={property.alt}
              width={500}
              height={300}
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        {property.featured && (
          <Badge className={cn(
            "absolute top-3 left-3 border-none",
            isSpotlight ? "bg-amber-500 text-white" : "bg-blue-600 text-white"
          )}>
            {isSpotlight ? "Spotlight" : "Featured"}
          </Badge>
        )}
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 bg-background/90 text-foreground"
        >
          {property.type}
        </Badge>
      </div>

      <CardContent className="p-4 md:p-6">
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-bold mb-2 leading-tight">
            <Link
              href={`/properties/${property.slug}`}
              className="hover:text-primary transition-colors"
            >
              {property.title}
            </Link>
          </h3>
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>{property.location}</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-primary mb-3">
            {property.price}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-4 py-3 border-t border-b">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-muted-foreground" />
            {/* CHANGE 4: Update property names to match the shared type */}
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-muted-foreground" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">BUA: {property.area}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Ref:{" "}
            <span className="font-medium text-foreground">{property.ref}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Enquire
            </Button>
            <Button variant="outline" size="sm">
              WhatsApp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
