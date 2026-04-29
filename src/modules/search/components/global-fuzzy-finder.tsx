"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  HardHat,
  Home,
  MapPin,
  Loader2,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { globalSearchAction, getSearchSuggestionsAction } from "@/actions/search";
import { SearchResult, SearchResultType, SearchPurpose } from "@/modules/search/types/search.types";
import { SearchSuggestionCard } from "./search-suggestion-card";
import Link from "next/link";

interface GlobalFuzzyFinderProps {
  purpose?: SearchPurpose;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function GlobalFuzzyFinder({
  purpose = "all",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: GlobalFuzzyFinderProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? setControlledOpen! : setOpen;

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setIsOpen, isOpen]);

  React.useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await globalSearchAction({ query, purpose });
        if (response.data) {
          setResults(response.data);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query, purpose]);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await getSearchSuggestionsAction(purpose);
        if (response.data) {
          setSuggestions(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    };

    if (isOpen && (results.length === 0 || !query)) {
      fetchSuggestions();
    }
  }, [isOpen, results.length, query, purpose]);

  const onSelect = (result: SearchResult) => {
    setIsOpen(false);
    router.push(result.link);
  };

  const categorizedResults = React.useMemo(() => {
    const categories: Record<SearchResultType, SearchResult[]> = {
      [SearchResultType.LOCATION]: [],
      [SearchResultType.PROJECT]: [],
      [SearchResultType.PROPERTY]: [],
      [SearchResultType.DEVELOPER]: [],
    };

    results.forEach((result) => {
      categories[result.type].push(result);
    });

    return categories;
  }, [results]);

  const getIcon = (type: SearchResultType) => {
    switch (type) {
      case SearchResultType.LOCATION:
        return <MapPin className="mr-2 h-4 w-4 text-yellow-500" />;
      case SearchResultType.PROJECT:
        return <Building2 className="mr-2 h-4 w-4 text-yellow-500" />;
      case SearchResultType.PROPERTY:
        return <Home className="mr-2 h-4 w-4 text-yellow-500" />;
      case SearchResultType.DEVELOPER:
        return <HardHat className="mr-2 h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <>
      {trigger && (
        <div onClick={() => setIsOpen(true)}>
          {trigger}
        </div>
      )}
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search for locations, projects, properties..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
            </div>
          )}
          
          {!loading && query && results.length === 0 && (
            <div className="p-6 text-center">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">No results found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  No results found matching your search. Here are some properties we think you&apos;ll love.
                </p>
              </div>

              {suggestions.length > 0 && (
                <div className="mt-8 text-left">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 px-1">
                    Our Suggestions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {suggestions.slice(0, 3).map((suggestion) => (
                      <SearchSuggestionCard
                        key={`${suggestion.type}-${suggestion.id}`}
                        suggestion={suggestion}
                        onSelect={onSelect}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t text-sm">
                <p className="text-muted-foreground">
                  Can&apos;t find what you&apos;re looking for?{" "}
                  <Link 
                    href="/contact?subject=Missing Property" 
                    className="text-yellow-600 hover:underline font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Report Missing Property
                  </Link>
                </p>
              </div>
            </div>
          )}
          
          {!loading && results.length > 0 && Object.entries(categorizedResults).map(([type, items]) => {
            if (items.length === 0) return null;
            
            const heading = type.charAt(0) + type.slice(1).toLowerCase() + "s";
            
            return (
              <CommandGroup key={type} heading={heading}>
                {items.map((result) => (
                  <CommandItem
                    key={`${result.type}-${result.id}`}
                    value={`${result.type}-${result.title}`}
                    onSelect={() => onSelect(result)}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    {getIcon(result.type as SearchResultType)}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.title}</span>
                        {result.badge && (
                          <Badge variant="outline" className="text-[10px] py-0 h-4 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                            {result.badge}
                          </Badge>
                        )}
                      </div>
                      {result.subtitle && (
                        <span className="text-xs text-muted-foreground">
                          {result.subtitle}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
