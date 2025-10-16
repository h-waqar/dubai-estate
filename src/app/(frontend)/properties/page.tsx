// src\app\(frontend)\properties\page.tsx
"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import property1 from "&/assets/property-1.jpg";
import property2 from "&/assets/property-2.jpg";
import property3 from "&/assets/property-3.jpg";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyBreadcrumb from "@/components/properties/PropertyBreadcrumb";
import PropertyHeader from "@/components/properties/PropertyHeader";
import { Property } from "@/types/sections";

// Sample property data
// In a real application, this data would come from an API or database

const allProperties: Property[] = [
  {
    id: 1,
    image: property1.src,
    alt: "Luxury Apartment in Downtown Dubai",
    title: "Luxury Apartment in Downtown Dubai",
    location: "Downtown Dubai",
    price: "AED 2,500,000",
    bedrooms: 3,
    bathrooms: 2,
    area: "1,850 sq ft",
    type: "Apartment",
    featured: true,
    ref: "LP46485",
    status: "Ready",
  },
  {
    id: 2,
    image: property2.src,
    alt: "Marina View Villa",
    title: "Marina View Villa",
    location: "Dubai Marina",
    price: "AED 8,900,000",
    bedrooms: 5,
    bathrooms: 4,
    area: "4,200 sq ft",
    type: "Villa",
    featured: true,
    ref: "LP46486",
    status: "Offplan",
  },
  {
    id: 3,
    image: property3.src,
    alt: "Penthouse with City View",
    title: "Penthouse with City View",
    location: "Business Bay",
    price: "AED 5,750,000",
    bedrooms: 4,
    bathrooms: 3,
    area: "2,800 sq ft",
    type: "Penthouse",
    featured: false,
    ref: "LP46487",
    status: "Ready",
  },
  {
    id: 4,
    image: property1.src,
    alt: "Modern Apartment in JBR",
    title: "Modern Apartment in JBR",
    location: "Jumeirah Beach Residence",
    price: "AED 3,200,000",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,400 sq ft",
    type: "Apartment",
    featured: false,
    ref: "LP46488",
    status: "Ready",
  },
  {
    id: 5,
    image: property2.src,
    alt: "Waterfront Villa in Palm Jumeirah",
    title: "Waterfront Villa in Palm Jumeirah",
    location: "Palm Jumeirah",
    price: "AED 12,500,000",
    bedrooms: 6,
    bathrooms: 5,
    area: "5,200 sq ft",
    type: "Villa",
    featured: true,
    ref: "LP46489",
    status: "Offplan",
  },
  {
    id: 6,
    image: property3.src,
    alt: "Studio Apartment in Dubai Marina",
    title: "Studio Apartment in Dubai Marina",
    location: "Dubai Marina",
    price: "AED 850,000",
    bedrooms: 1,
    bathrooms: 1,
    area: "650 sq ft",
    type: "Studio",
    featured: false,
    ref: "LP46490",
    status: "Ready",
  },
];

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const processedProperties = useMemo(() => {
    const filtered = allProperties.filter((property) => {
      // Helper function to parse price string to number
      const parsePrice = (priceStr: string) =>
        parseInt(priceStr.replace(/AED|,|\s/g, ""));

      // Search Query Filter
      const matchesSearch =
        searchQuery === "" ||
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Property Type Filter
      const matchesType =
        !propertyType || property.type.toLowerCase() === propertyType;

      // Bedrooms Filter
      const matchesBeds =
        !bedrooms ||
        (bedrooms === "4+"
          ? property.bedrooms >= 4
          : property.bedrooms === parseInt(bedrooms));

      // Price Range Filter
      const price = parsePrice(property.price);
      let matchesPrice = true;
      if (priceRange) {
        switch (priceRange) {
          case "under-1m":
            matchesPrice = price < 1000000;
            break;
          case "1m-5m":
            matchesPrice = price >= 1000000 && price <= 5000000;
            break;
          case "5m-10m":
            matchesPrice = price > 5000000 && price <= 10000000;
            break;
          case "over-10m":
            matchesPrice = price > 10000000;
            break;
        }
      }

      return matchesSearch && matchesType && matchesBeds && matchesPrice;
    });

    // Sorting Logic
    const sorted = [...filtered].sort((a, b) => {
      const priceA = parseInt(a.price.replace(/AED |,|\s/g, ""));
      const priceB = parseInt(b.price.replace(/AED |,|\s/g, ""));

      switch (sortBy) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "newest":
          // Using ID as a proxy for "newest" since we don't have a date field
          return b.id - a.id;
        case "relevance":
        default:
          return 0; // Keep original order
      }
    });

    return sorted;
  }, [searchQuery, propertyType, bedrooms, priceRange, sortBy]);

  return (
    <div className="min-h-screen">
      <Header />

      <PropertyFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        bedrooms={bedrooms}
        setBedrooms={setBedrooms}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      <PropertyBreadcrumb />

      <PropertyHeader
        propertyCount={processedProperties.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Properties Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {processedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8">
              Load More Properties
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
