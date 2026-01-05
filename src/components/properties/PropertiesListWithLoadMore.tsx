"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { fetchProperties } from "@/app/(frontend)/properties/actions";
import { PropertyCardProps } from "@/types/sections";
import { Loader2 } from "lucide-react";

interface PropertiesListWithLoadMoreProps {
  initialProperties: PropertyCardProps["property"][];
  initialTotal: number;
  filters: any;
  limit?: number;
}

export default function PropertiesListWithLoadMore({
  initialProperties,
  initialTotal,
  filters,
  limit = 3,
}: PropertiesListWithLoadMoreProps) {
  const [properties, setProperties] = useState(initialProperties);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Reset state when filters change (detected by initialProperties changing)
  useEffect(() => {
    setProperties(initialProperties);
    setTotal(initialTotal);
    setPage(1);
  }, [initialProperties, initialTotal]);

  const hasMore = properties.length < total;

  const loadMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const result = await fetchProperties({
        ...filters,
        page: nextPage,
        limit: limit,
      });

      setProperties((prev) => [...prev, ...result.data]);
      setPage(nextPage);
      // Update total just in case
      setTotal(result.total);
    } catch (error) {
      console.error("Failed to load more properties", error);
    } finally {
      setLoading(false);
    }
  };

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/30 rounded-lg border border-border mx-auto max-w-2xl">
        <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
        <p className="text-muted-foreground mb-6">
          We couldn't find any properties matching your criteria. Try adjusting your filters.
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/properties'}
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <PropertyCard 
            key={`${property.id}-${property.slug}`} 
            property={property} 
            priority={index < 6}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="px-8 min-w-[200px]"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Properties"
            )}
          </Button>
          <div className="mt-2 text-sm text-muted-foreground">
            Showing {properties.length} of {total} properties
          </div>
        </div>
      )}
    </>
  );
}
