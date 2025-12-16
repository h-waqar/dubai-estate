"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

interface PropertyType {
  id: number;
  name: string;
  slug: string;
}

interface HeroProps {
  propertyTypes: PropertyType[];
}

export default function Hero({ propertyTypes }: HeroProps) {
  const router = useRouter();

  // Search State
  const [purpose, setPurpose] = useState("buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (purpose) params.set("status", purpose); // 'buy' or 'rent' maps to 'status'
    if (location.trim()) params.set("search", location.trim());
    if (propertyType && propertyType !== "all") params.set("type", propertyType);
    if (bedrooms && bedrooms !== "all") params.set("bedrooms", bedrooms);
    if (priceRange && priceRange !== "all") params.set("price", priceRange);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[500px] h-[70vh] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/dubai-hero.jpg"
          alt="Dubai Estate Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 w-full">
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">

          {/* Hero Text */}
          <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg tracking-tight">
              Find Your <span className="text-yellow-400">Dream Home</span>
            </h1>
            <p className="text-base md:text-lg text-gray-100 max-w-2xl mx-auto drop-shadow-md font-medium">
              Discover the finest properties across Dubai
            </p>
          </div>

          {/* Search Widget Container */}
          <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ring-1 ring-black/5 max-w-3xl">

            {/* Top Section: Toggle Group */}
            <div className="border-b border-gray-100 dark:border-gray-800 p-2 bg-gray-50/50 dark:bg-gray-800/50">
              <ToggleGroup
                type="single"
                value={purpose}
                onValueChange={(value) => { if (value) setPurpose(value); }}
                className="justify-start w-full"
              >
                <ToggleGroupItem value="buy" className="flex-1 data-[state=on]:bg-white data-[state=on]:text-yellow-600 data-[state=on]:shadow-sm data-[state=on]:font-semibold">Buy</ToggleGroupItem>
                <ToggleGroupItem value="rent" className="flex-1 data-[state=on]:bg-white data-[state=on]:text-yellow-600 data-[state=on]:shadow-sm data-[state=on]:font-semibold">Rent</ToggleGroupItem>
                <ToggleGroupItem value="off_plan" className="flex-1 data-[state=on]:bg-white data-[state=on]:text-yellow-600 data-[state=on]:shadow-sm data-[state=on]:font-semibold">Off Plan</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="p-3 md:p-4 space-y-2">
              {/* Middle Section: Search & Button */}
              <div className="flex flex-col md:flex-row gap-2">
                {/* Location Input */}
                <div className="flex-grow relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                  <Input
                    placeholder="Enter location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-10 pl-9 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-yellow-500/20 focus:border-yellow-500 rounded-lg transition-all"
                  />
                </div>

                {/* Search Button (Desktop) */}
                <Button
                  onClick={handleSearch}
                  className="hidden md:flex h-10 px-6 text-sm font-bold bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all min-w-[100px]"
                >
                  Search
                </Button>
              </div>

              {/* Bottom Section: Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Property Type */}
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-9 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-yellow-500/50 transition-colors focus:ring-0 focus:border-yellow-500 text-xs font-medium px-3">
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

                {/* Bedrooms */}
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger className="h-9 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-yellow-500/50 transition-colors focus:ring-0 focus:border-yellow-500 text-xs font-medium px-3">
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Bed</SelectItem>
                    <SelectItem value="1">1 Bed</SelectItem>
                    <SelectItem value="2">2 Beds</SelectItem>
                    <SelectItem value="3">3 Beds</SelectItem>
                    <SelectItem value="4">4 Beds</SelectItem>
                    <SelectItem value="5+">5+ Beds</SelectItem>
                  </SelectContent>
                </Select>

                {/* Price Range */}
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-9 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-yellow-500/50 transition-colors focus:ring-0 focus:border-yellow-500 text-xs font-medium px-3">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    {purpose === "rent" ? (
                      <>
                        <SelectItem value="under-50k">Under 50k</SelectItem>
                        <SelectItem value="50k-100k">50k - 100k</SelectItem>
                        <SelectItem value="100k-200k">100k - 200k</SelectItem>
                        <SelectItem value="over-200k">Over 200k</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="under-1m">Under 1M</SelectItem>
                        <SelectItem value="1m-3m">1M - 3M</SelectItem>
                        <SelectItem value="3m-5m">3M - 5M</SelectItem>
                        <SelectItem value="over-5m">Over 5M</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>

                {/* Search Button (Mobile Only) */}
                <Button
                  onClick={handleSearch}
                  className="md:hidden w-full h-10 text-sm font-bold bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm"
                >
                  Search Properties
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
