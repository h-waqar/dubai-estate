// // src\components\properties\PropertyCard.tsx
// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MapPin, Bed, Bath, Square } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// // Define the type for a single property
// export interface Property {
//   id: number;
//   image: string;
//   title: string;
//   location: string;
//   price: string;
//   beds: number;
//   baths: number;
//   size: string;
//   type: string;
//   featured: boolean;
//   ref: string;
//   status?: "Offplan" | "Ready"; // Optional status
// }

// interface PropertyCardProps {
//   property: Property;
// }

// const PropertyCard = ({ property }: PropertyCardProps) => {
//   // Add a guard clause to handle cases where property is not yet available
//   if (!property) {
//     return null; // Or you can return a loading skeleton here
//   }

//   return (
//     <Card className="property-card overflow-hidden group">
//       <div className="relative">
//         <Link href={`/properties/${property.id}`}>
//           <div className="overflow-hidden">
//             <Image
//               src={property.image}
//               alt={property.title}
//               width={500}
//               height={300}
//               className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
//             />
//           </div>
//         </Link>
//         {property.featured && (
//           <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
//             Featured
//           </Badge>
//         )}
//         <Badge
//           variant="secondary"
//           className="absolute top-3 right-3 bg-background/90 text-foreground"
//         >
//           {property.type}
//         </Badge>
//         {property.status === "Offplan" && (
//           <Badge className="absolute bottom-3 left-3 bg-golden-accent text-black font-semibold">
//             Offplan
//           </Badge>
//         )}
//       </div>

//       <CardContent className="p-4 md:p-6">
//         <div className="mb-4">
//           <h3 className="text-lg md:text-xl font-bold mb-2 leading-tight">
//             <Link
//               href={`/properties/${property.id}`}
//               className="hover:text-primary transition-colors"
//             >
//               {property.title}
//             </Link>
//           </h3>
//           <div className="flex items-center text-muted-foreground text-sm mb-3">
//             <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
//             <span>{property.location}</span>
//           </div>
//           <div className="text-xl md:text-2xl font-bold text-primary mb-3">
//             {property.price}
//           </div>
//         </div>

//         <div className="flex items-center justify-between text-sm mb-4 py-3 border-t border-b">
//           <div className="flex items-center gap-1">
//             <Bed className="w-4 h-4 text-muted-foreground" />
//             <span>{property.beds} Beds</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Bath className="w-4 h-4 text-muted-foreground" />
//             <span>{property.baths} Baths</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Square className="w-4 h-4 text-muted-foreground" />
//             <span className="truncate">BUA: {property.size}</span>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="text-sm text-muted-foreground">
//             Ref:{" "}
//             <span className="font-medium text-foreground">{property.ref}</span>
//           </div>
//           <div className="flex gap-2">
//             <Button variant="outline" size="sm">
//               Enquire
//             </Button>
//             <Button variant="outline" size="sm">
//               WhatsApp
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default PropertyCard;

// src/components/properties/PropertyCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// CHANGE 1: Import the shared types from our "single source of truth"
import { PropertyCardProps } from "@/types/sections";

// CHANGE 2: Remove the local 'Property' and 'PropertyCardProps' interfaces.
// They are no longer needed here.

const PropertyCard = ({ property }: PropertyCardProps) => {
  if (!property) {
    return null;
  }

  return (
    <Card className="property-card overflow-hidden group">
      <div className="relative">
        <Link href={`/properties/${property.id}`}>
          <div className="overflow-hidden">
            <Image
              src={property.image}
              // CHANGE 3: Use the standardized 'alt' property
              alt={property.alt}
              width={500}
              height={300}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        {property.featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 bg-background/90 text-foreground"
        >
          {property.type}
        </Badge>
        {property.status === "Offplan" && (
          <Badge className="absolute bottom-3 left-3 bg-golden-accent text-black font-semibold">
            Offplan
          </Badge>
        )}
      </div>

      <CardContent className="p-4 md:p-6">
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-bold mb-2 leading-tight">
            <Link
              href={`/properties/${property.id}`}
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
