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

const PropertyFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("type") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [priceRange, setPriceRange] = useState(searchParams.get("price") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "buy");

  // Sync local state with URL params if they change externally (e.g. back button)
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setPropertyType(searchParams.get("type") || "");
    setBedrooms(searchParams.get("bedrooms") || "");
    setPriceRange(searchParams.get("price") || "");
    setStatus(searchParams.get("status") || "buy");
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (propertyType) params.set("type", propertyType);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (priceRange) params.set("price", priceRange);
    if (status) params.set("status", status);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="section-bg-light py-8 border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search Neighborhood, City Or Building"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
            </SelectContent>
          </Select>

          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent>
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
              <SelectItem value="under-1m">Under 1M</SelectItem>
              <SelectItem value="1m-5m">1M - 5M</SelectItem>
              <SelectItem value="5m-10m">5M - 10M</SelectItem>
              <SelectItem value="over-10m">Over 10M</SelectItem>
            </SelectContent>
          </Select>

          <Button className="px-8" onClick={handleSearch}>Search</Button>
        </div>
      </div>
    </section>
  );
};

export default PropertyFilters;
