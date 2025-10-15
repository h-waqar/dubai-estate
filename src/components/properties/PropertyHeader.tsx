"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyHeaderProps {
  propertyCount: number;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  propertyCount,
  sortBy,
  setSortBy,
}) => {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Property for Sale in Dubai
            </h1>
            <p className="text-muted-foreground">{propertyCount} results</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyHeader;
