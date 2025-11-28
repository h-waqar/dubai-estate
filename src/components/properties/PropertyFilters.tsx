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
import { useRouter, useSearchParams } from "next/navigation";

import { useDebounce } from "@/hooks/use-debounce";

interface PropertyFiltersProps {
  propertyTypes: { id: number; name: string; slug: string }[];
}

const PropertyFilters = ({ propertyTypes }: PropertyFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("type") || "all");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "all");
  const [priceRange, setPriceRange] = useState(searchParams.get("price") || "all");
  const [status, setStatus] = useState(searchParams.get("status") || "all");

  // Debounce search query to avoid excessive URL updates
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Effect to update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearchQuery) params.set("search", debouncedSearchQuery);
    if (propertyType && propertyType !== "all") params.set("type", propertyType);
    if (bedrooms && bedrooms !== "all") params.set("bedrooms", bedrooms);
    if (priceRange && priceRange !== "all") params.set("price", priceRange);
    if (status && status !== "all") params.set("status", status);

    router.push(`/properties?${params.toString()}`);
  }, [debouncedSearchQuery, propertyType, bedrooms, priceRange, status, router]);

  // Sync local state with URL params if they change externally (e.g. back button)
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setPropertyType(searchParams.get("type") || "all");
    setBedrooms(searchParams.get("bedrooms") || "all");
    setPriceRange(searchParams.get("price") || "all");
    setStatus(searchParams.get("status") || "all");
  }, [searchParams]);

  return (
    <section className="section-bg-light py-8 border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32">
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
            <SelectTrigger className="w-40">
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
            <SelectTrigger className="w-32">
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
            <SelectTrigger className="w-32">
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
