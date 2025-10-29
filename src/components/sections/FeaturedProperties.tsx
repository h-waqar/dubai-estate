// // src/components/sections/FeaturedProperties.tsx
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   ChevronLeft,
//   ChevronRight,
//   MapPin,
//   Bed,
//   Bath,
//   Square,
// } from "lucide-react";
// import { Property, PropertyCardProps } from "@/types/featured-properties";

// const properties: Property[] = [
//   {
//     id: 1,
//     image: "/assets/property-1.jpg",
//     alt: "Luxury Apartment in Downtown Dubai",
//     featured: true,
//     type: "Apartment",
//     title: "Luxury Apartment in Downtown Dubai",
//     location: "Downtown Dubai",
//     price: "AED 2,500,000",
//     bedrooms: 3,
//     bathrooms: 2,
//     area: "1,850 sq ft",
//   },
//   {
//     id: 2,
//     image: "/assets/property-2.jpg",
//     alt: "Marina View Villa",
//     featured: true,
//     type: "Villa",
//     title: "Marina View Villa",
//     location: "Dubai Marina",
//     price: "AED 8,900,000",
//     bedrooms: 5,
//     bathrooms: 4,
//     area: "4,200 sq ft",
//   },
//   {
//     id: 3,
//     image: "/assets/property-3.jpg",
//     alt: "Penthouse with City View",
//     featured: false,
//     type: "Penthouse",
//     title: "Penthouse with City View",
//     location: "Business Bay",
//     price: "AED 5,750,000",
//     bedrooms: 4,
//     bathrooms: 3,
//     area: "2,800 sq ft",
//   },
//   {
//     id: 4,
//     image: "/assets/property-1.jpg",
//     alt: "Modern Apartment in JBR",
//     featured: false,
//     type: "Apartment",
//     title: "Modern Apartment in JBR",
//     location: "Jumeirah Beach Residence",
//     price: "AED 3,200,000",
//     bedrooms: 2,
//     bathrooms: 2,
//     area: "1,400 sq ft",
//   },
//   {
//     id: 5,
//     image: "/assets/property-2.jpg",
//     alt: "Beachfront Villa",
//     featured: true,
//     type: "Villa",
//     title: "Beachfront Villa",
//     location: "Palm Jumeirah",
//     price: "AED 12,500,000",
//     bedrooms: 6,
//     bathrooms: 5,
//     area: "5,500 sq ft",
//   },
//   {
//     id: 6,
//     image: "/assets/property-3.jpg",
//     alt: "City Center Apartment",
//     featured: false,
//     type: "Apartment",
//     title: "City Center Apartment",
//     location: "DIFC",
//     price: "AED 4,800,000",
//     bedrooms: 3,
//     bathrooms: 3,
//     area: "2,200 sq ft",
//   },
// ];

// function PropertyCard({ property }: PropertyCardProps) {
//   return (
//     <Card className="h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
//       <div className="relative h-48">
//         <Image
//           src={property.image}
//           alt={property.alt}
//           fill
//           className="object-cover"
//         />
//         {property.featured && (
//           <Badge className="absolute top-3 left-3 bg-yellow-500 text-white border-0 hover:bg-yellow-600">
//             Featured
//           </Badge>
//         )}
//         <div className="absolute top-3 right-3">
//           <Badge
//             variant="secondary"
//             className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
//           >
//             {property.type}
//           </Badge>
//         </div>
//       </div>
//       <CardContent className="p-6">
//         <div className="mb-3">
//           <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">
//             {property.title}
//           </h3>
//           <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
//             <MapPin className="w-4 h-4 mr-1" />
//             {property.location}
//           </div>
//         </div>
//         <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500 mb-4">
//           {property.price}
//         </div>
//         <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
//           <div className="flex items-center">
//             <Bed className="w-4 h-4 mr-1" />
//             {property.bedrooms}
//           </div>
//           <div className="flex items-center">
//             <Bath className="w-4 h-4 mr-1" />
//             {property.bathrooms}
//           </div>
//           <div className="flex items-center">
//             <Square className="w-4 h-4 mr-1" />
//             {property.area}
//           </div>
//         </div>
//         <Button
//           variant="outline"
//           className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//         >
//           View Details
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

// export default function FeaturedProperties() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [slidesPerView, setSlidesPerView] = useState(4);

//   // Calculate slides per view based on window size
//   const updateSlidesPerView = useCallback(() => {
//     if (typeof window === "undefined") return;

//     const width = window.innerWidth;
//     if (width < 768) {
//       setSlidesPerView(1);
//     } else if (width < 1024) {
//       setSlidesPerView(2);
//     } else if (width < 1280) {
//       setSlidesPerView(3);
//     } else {
//       setSlidesPerView(4);
//     }
//   }, []);

//   useEffect(() => {
//     updateSlidesPerView();
//     window.addEventListener("resize", updateSlidesPerView);
//     return () => window.removeEventListener("resize", updateSlidesPerView);
//   }, [updateSlidesPerView]);

//   const maxIndex = Math.max(0, properties.length - slidesPerView);
//   const canGoNext = currentIndex < maxIndex;
//   const canGoPrev = currentIndex > 0;

//   const nextSlide = () => {
//     if (canGoNext) {
//       setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
//     }
//   };

//   const prevSlide = () => {
//     if (canGoPrev) {
//       setCurrentIndex((prev) => Math.max(prev - 1, 0));
//     }
//   };

//   const goToSlide = (index: number) => {
//     setCurrentIndex(Math.min(index, maxIndex));
//   };

//   const totalDots = Math.ceil(properties.length / slidesPerView);

//   return (
//     <section className="py-20 bg-gray-50 dark:bg-gray-900">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
//           <div>
//             <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
//               Featured Properties
//             </h2>
//             <p className="text-xl text-gray-600 dark:text-gray-300">
//               Discover the finest luxury properties in Dubai&apos;s most
//               prestigious locations
//             </p>
//           </div>
//           <div className="flex space-x-2">
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={prevSlide}
//               disabled={!canGoPrev}
//               className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </Button>
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={nextSlide}
//               disabled={!canGoNext}
//               className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronRight className="w-5 h-5" />
//             </Button>
//           </div>
//         </div>

//         {/* Carousel Container */}
//         <div className="relative overflow-hidden mb-8">
//           <div
//             className="flex transition-transform py-6 duration-500 ease-out gap-6"
//             style={{
//               transform: `translateX(-${
//                 currentIndex * (100 / slidesPerView)
//               }%)`,
//             }}
//           >
//             {properties.map((property) => (
//               <div
//                 key={property.id}
//                 className="flex-shrink-0"
//                 style={{
//                   width: `calc(${100 / slidesPerView}% - ${
//                     (slidesPerView - 1) * 1.5
//                   }rem / ${slidesPerView})`,
//                 }}
//               >
//                 <PropertyCard property={property} />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Navigation Dots */}
//         <div className="flex justify-center mb-8 space-x-2">
//           {Array.from({ length: totalDots }).map((_, index) => (
//             <button
//               key={index}
//               onClick={() => goToSlide(index)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                 Math.floor(currentIndex / slidesPerView) === index
//                   ? "bg-yellow-500 dark:bg-yellow-400 w-8"
//                   : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
//               }`}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>

//         {/* View All Button */}
//         <div className="text-center">
//           <Link href="/properties">
//             <Button
//               size="lg"
//               className="px-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
//             >
//               View All Properties
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// src/components/sections/FeaturedProperties.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
  Square,
} from "lucide-react";
import { Property, PropertyCardProps } from "@/types/featured-properties";

const properties: Property[] = [
  {
    id: 1,
    image: "/assets/property-1.jpg",
    alt: "Luxury Apartment in Downtown Dubai",
    featured: true,
    type: "Apartment",
    title: "Luxury Apartment in Downtown Dubai",
    location: "Downtown Dubai",
    price: "AED 2,500,000",
    bedrooms: 3,
    bathrooms: 2,
    area: "1,850 sq ft",
  },
  {
    id: 2,
    image: "/assets/property-2.jpg",
    alt: "Marina View Villa",
    featured: true,
    type: "Villa",
    title: "Marina View Villa",
    location: "Dubai Marina",
    price: "AED 8,900,000",
    bedrooms: 5,
    bathrooms: 4,
    area: "4,200 sq ft",
  },
  {
    id: 3,
    image: "/assets/property-3.jpg",
    alt: "Penthouse with City View",
    featured: false,
    type: "Penthouse",
    title: "Penthouse with City View",
    location: "Business Bay",
    price: "AED 5,750,000",
    bedrooms: 4,
    bathrooms: 3,
    area: "2,800 sq ft",
  },
  {
    id: 4,
    image: "/assets/property-1.jpg",
    alt: "Modern Apartment in JBR",
    featured: false,
    type: "Apartment",
    title: "Modern Apartment in JBR",
    location: "Jumeirah Beach Residence",
    price: "AED 3,200,000",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,400 sq ft",
  },
  {
    id: 5,
    image: "/assets/property-2.jpg",
    alt: "Beachfront Villa",
    featured: true,
    type: "Villa",
    title: "Beachfront Villa",
    location: "Palm Jumeirah",
    price: "AED 12,500,000",
    bedrooms: 6,
    bathrooms: 5,
    area: "5,500 sq ft",
  },
  {
    id: 6,
    image: "/assets/property-3.jpg",
    alt: "City Center Apartment",
    featured: false,
    type: "Apartment",
    title: "City Center Apartment",
    location: "DIFC",
    price: "AED 4,800,000",
    bedrooms: 3,
    bathrooms: 3,
    area: "2,200 sq ft",
  },
];

function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative h-48">
        <Image
          src={property.image}
          alt={property.alt}
          fill
          className="object-cover"
        />
        {property.featured && (
          <Badge className="absolute top-3 left-3 bg-yellow-500 text-white border-0 hover:bg-yellow-600">
            Featured
          </Badge>
        )}
        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
          >
            {property.type}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {property.location}
          </div>
        </div>
        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500 mb-4">
          {property.price}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            {property.bedrooms}
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            {property.bathrooms}
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            {property.area}
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

export default function FeaturedProperties() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);

  // Calculate slides per view based on window size
  const updateSlidesPerView = useCallback(() => {
    if (typeof window === "undefined") return;

    const width = window.innerWidth;
    if (width < 768) {
      setSlidesPerView(1);
    } else if (width < 1024) {
      setSlidesPerView(2);
    } else if (width < 1280) {
      setSlidesPerView(3);
    } else {
      setSlidesPerView(4);
    }
  }, []);

  useEffect(() => {
    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, [updateSlidesPerView]);

  const maxIndex = Math.max(0, properties.length - slidesPerView);
  const canGoNext = currentIndex < maxIndex;
  const canGoPrev = currentIndex > 0;

  const nextSlide = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    }
  };

  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  const totalDots = Math.ceil(properties.length / slidesPerView);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Discover the finest luxury properties in Dubai&apos;s most
              prestigious locations
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={!canGoPrev}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={!canGoNext}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden mb-8">
          <div
            className="flex transition-transform duration-500 ease-out py-4"
            style={{
              transform: `translateX(-${
                currentIndex * (100 / slidesPerView)
              }%)`,
            }}
          >
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex-shrink-0 pr-2 last:pr-0"
                style={{
                  width: `calc(${100 / slidesPerView}% - ${
                    (slidesPerView - 1) * 1.5
                  }rem / ${slidesPerView})`,
                }}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mb-8 space-x-2">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / slidesPerView) === index
                  ? "bg-yellow-500 dark:bg-yellow-400 w-8"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/properties">
            <Button
              size="lg"
              className="px-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
