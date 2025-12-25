"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { useDebounce } from "@/hooks/use-debounce";

interface PropertyFiltersProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  forcedListingType?: "buy" | "rent" | "off_plan";
}

const PropertyFilters = ({ propertyTypes, forcedListingType }: PropertyFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize state
  // We map 'location' param to 'search' state so it appears in the input and isn't lost
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || searchParams.get("location") || ""
  );
  const [propertyType, setPropertyType] = useState(searchParams.get("type") || "all");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "all");
  const [priceRange, setPriceRange] = useState(searchParams.get("price") || "all");

  // Status is slightly more complex: it might come from prop or URL
  const [status, setStatus] = useState(
    forcedListingType || searchParams.get("status") || "all"
  );

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Effect to update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    // Add query params
    if (debouncedSearchQuery) params.set("search", debouncedSearchQuery);
    if (propertyType && propertyType !== "all") params.set("type", propertyType);
    if (bedrooms && bedrooms !== "all") params.set("bedrooms", bedrooms);
    if (priceRange && priceRange !== "all") params.set("price", priceRange);

    // Status handling (for "all" or specific overrides if needed)
    // Note: If we are on a dedicated route, we generally don't need ?status=... 
    // UNLESS we are on /properties and selected a specific status that doesn't have a route yet (none in this case).
    if (status === "all") {
      // if we are on a specific route but selected "all", we should go to /properties
    }

    // Determine target path
    let targetPath = pathname;

    if (status === "buy") targetPath = "/for-sale";
    else if (status === "rent") targetPath = "/for-rent";
    else if (status === "off_plan") targetPath = "/off-plan";
    else if (status === "all") targetPath = "/properties";

    // Compare with current full URL to avoid loops or unnecessary pushes
    const queryString = params.toString();
    const finalUrl = `${targetPath}${queryString ? `?${queryString}` : ""}`;

    // Only push if different
    if (finalUrl !== `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`) {
      router.push(finalUrl);
    }

  }, [debouncedSearchQuery, propertyType, bedrooms, priceRange, status, router, pathname, searchParams]);

  // Sync from URL/Prop changes
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || searchParams.get("location") || "");
    setPropertyType(searchParams.get("type") || "all");
    setBedrooms(searchParams.get("bedrooms") || "all");
    setPriceRange(searchParams.get("price") || "all");

    // If we are on a dedicated page, forcedListingType wins
    if (forcedListingType) {
      setStatus(forcedListingType);
    } else {
      setStatus(searchParams.get("status") || "all");
    }
  }, [searchParams, forcedListingType]);

  return (
    <section className="section-bg-light py-4 border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Select
            value={status}
            onValueChange={(val) => setStatus(val)} // Just update state, effect handles navigation
          >
            <SelectTrigger className="w-32 cursor-pointer">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="off_plan">Off Plan</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search Neighborhood, City Or Building"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-40 cursor-pointer">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type.id} value={type.slug}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger className="w-32 cursor-pointer">
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Bed</SelectItem>
              <SelectItem value="1">1 Bed</SelectItem>
              <SelectItem value="2">2 Beds</SelectItem>
              <SelectItem value="3">3 Beds</SelectItem>
              <SelectItem value="4+">4+ Beds</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-32 cursor-pointer">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="under-1m">Under 1M</SelectItem>
              <SelectItem value="1m-5m">1M - 5M</SelectItem>
              <SelectItem value="5m-10m">5M - 10M</SelectItem>
              <SelectItem value="over-10m">Over 10M</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default PropertyFilters;
