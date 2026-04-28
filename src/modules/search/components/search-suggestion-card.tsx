"use client";

import React from "react";
import Image from "next/image";
import { SearchResult } from "../types/search.types";
import { Badge } from "@/components/ui/badge";

interface SearchSuggestionCardProps {
  suggestion: SearchResult;
  onSelect: (suggestion: SearchResult) => void;
}

export function SearchSuggestionCard({ suggestion, onSelect }: SearchSuggestionCardProps) {
  return (
    <div 
      className="group relative flex flex-col gap-2 rounded-lg border p-3 hover:bg-accent transition-colors cursor-pointer"
      onClick={() => onSelect(suggestion)}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
        {suggestion.image ? (
          <Image
            src={suggestion.image}
            alt={suggestion.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold text-sm line-clamp-1">{suggestion.title}</h4>
          {suggestion.badge && (
            <Badge variant="outline" className="text-[10px] h-4 bg-yellow-500/10 text-yellow-600 border-yellow-500/20 whitespace-nowrap">
              {suggestion.badge}
            </Badge>
          )}
        </div>
        {suggestion.subtitle && (
          <p className="text-xs text-muted-foreground line-clamp-1">{suggestion.subtitle}</p>
        )}
      </div>
    </div>
  );
}
