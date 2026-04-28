"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { GlobalFuzzyFinder } from "@/modules/search/components/global-fuzzy-finder";
import { SearchPurpose } from "@/modules/search/types/search.types";

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

    // Map purpose to the correct base URL
    let baseUrl = "/properties"; // Default fallback

    if (purpose === "buy") {
      baseUrl = "/for-sale";
      params.set("status", "buy");
    } else if (purpose === "rent") {
      baseUrl = "/for-rent";
      params.set("status", "rent");
    } else if (purpose === "off_plan") {
      baseUrl = "/off-plan";
      params.set("status", "off_plan");
    }

    if (location.trim()) params.set("location", location.trim());
    if (propertyType && propertyType !== "all") params.set("type", propertyType);
    if (bedrooms && bedrooms !== "all") params.set("bedrooms", bedrooms);
    if (priceRange && priceRange !== "all") params.set("price", priceRange);

    router.push(`${baseUrl}?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[500px] h-[70vh] flex items-center justify-center">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/videos/hero-section-bg.webm" type="video/webm" />
          <Image
            src="/assets/images/dubai-hero.jpg"
            alt="Dubai Estate Hero"
            fill
            className="object-cover"
            priority
          />
        </video>
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
          <div className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ring-1 ring-white/20 border border-white/20 max-w-3xl">

            {/* Top Section: Toggle Group */}
            <div className="border-b border-gray-200/50 dark:border-gray-700/50 p-3 md:p-4 bg-white/40 dark:bg-gray-800/40 rounded-tl-lg rounded-tr-lg">
              <ToggleGroup
                type="single"
                value={purpose}
                onValueChange={(value) => { if (value) setPurpose(value); }}
                className="justify-start w-full"
              >
                <ToggleGroupItem value="buy" className="flex-1 h-10 data-[state=on]:bg-yellow-500 data-[state=on]:text-white data-[state=on]:shadow-md data-[state=on]:font-bold text-gray-600 dark:text-gray-300 font-medium transition-all duration-300">Buy</ToggleGroupItem>
                <ToggleGroupItem value="rent" className="flex-1 h-10 data-[state=on]:bg-yellow-500 data-[state=on]:text-white data-[state=on]:shadow-md data-[state=on]:font-bold text-gray-600 dark:text-gray-300 font-medium transition-all duration-300">Rent</ToggleGroupItem>
                <ToggleGroupItem value="off_plan" className="flex-1 h-10 data-[state=on]:bg-yellow-500 data-[state=on]:text-white data-[state=on]:shadow-md data-[state=on]:font-bold text-gray-600 dark:text-gray-300 font-medium transition-all duration-300">Off Plan</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="p-5 md:p-6 space-y-4">
              {/* Middle Section: Search & Button */}
              <div className="flex flex-col md:flex-row gap-3">
                {/* Global Search Trigger */}
                <div className="flex-grow relative">
                  <GlobalFuzzyFinder
                    purpose={purpose as SearchPurpose}
                    trigger={
                      <div className="flex items-center px-4 h-12 rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white/60 dark:bg-gray-800/60 shadow-sm cursor-text hover:border-yellow-400/50 hover:bg-white/80 transition-all duration-200 group">
                        <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0 group-hover:text-yellow-500 transition-colors" />
                        <span className="text-gray-500 text-sm md:text-base flex-grow">
                          {location || "Search for locations, projects, properties..."}
                        </span>
                        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                          <span className="text-xs">⌘</span>K
                        </kbd>
                      </div>
                    }
                  />
                </div>

                {/* Search Button (Desktop) */}
                <Button
                  onClick={handleSearch}
                  className="hidden md:flex h-12 px-8 text-base font-bold bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all min-w-[120px]"
                >
                  Search
                </Button>
              </div>

              {/* Bottom Section: Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Property Type */}
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-11 w-full bg-white/60 dark:bg-gray-800/60 border-gray-200/60 dark:border-gray-700/60 hover:bg-white hover:border-yellow-500/50 transition-all focus:ring-0 focus:border-yellow-500 text-sm font-medium px-4 rounded-xl shadow-sm">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95">
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
                  <SelectTrigger className="h-11 w-full bg-white/60 dark:bg-gray-800/60 border-gray-200/60 dark:border-gray-700/60 hover:bg-white hover:border-yellow-500/50 transition-all focus:ring-0 focus:border-yellow-500 text-sm font-medium px-4 rounded-xl shadow-sm">
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95">
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
                  <SelectTrigger className="h-11 w-full bg-white/60 dark:bg-gray-800/60 border-gray-200/60 dark:border-gray-700/60 hover:bg-white hover:border-yellow-500/50 transition-all focus:ring-0 focus:border-yellow-500 text-sm font-medium px-4 rounded-xl shadow-sm">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95">
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
                  className="md:hidden w-full h-12 text-base font-bold bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-md"
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
