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
import React from "react";

interface PropertyFiltersProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  propertyType: string;
  setPropertyType: React.Dispatch<React.SetStateAction<string>>;
  bedrooms: string;
  setBedrooms: React.Dispatch<React.SetStateAction<string>>;
  priceRange: string;
  setPriceRange: React.Dispatch<React.SetStateAction<string>>;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  propertyType,
  setPropertyType,
  bedrooms,
  setBedrooms,
  priceRange,
  setPriceRange,
}) => {
  return (
    <section className="section-bg-light py-8 border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Select defaultValue="buy">
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

          <Button className="px-8">Search</Button>
        </div>
      </div>
    </section>
  );
};

export default PropertyFilters;
