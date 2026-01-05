import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyBreadcrumb from "@/components/properties/PropertyBreadcrumb";
import PropertyHeader from "@/components/properties/PropertyHeader";
import { listProperties } from "@/modules/property/services/listProperties";
import { prisma } from "@/lib/prisma";
import { mapPropertyToCard } from "@/modules/property/utils/mapPropertyToCard";
import PropertiesListWithLoadMore from "./PropertiesListWithLoadMore";

interface PropertyListingsProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    forcedListingType?: "buy" | "rent" | "off_plan";
}

const PropertyListings = async ({ searchParams, forcedListingType }: PropertyListingsProps) => {
    const resolvedParams = await searchParams;

    // Use forcedListingType if provided, otherwise fallback to URL params
    const statusFilter = forcedListingType || (typeof resolvedParams.status === "string" ? resolvedParams.status : undefined);

    const filters = {
        searchQuery: typeof resolvedParams.search === "string" ? resolvedParams.search : undefined,
        propertyStatus: statusFilter,
        propertyType: typeof resolvedParams.type === "string" ? resolvedParams.type : undefined,
        bedrooms: typeof resolvedParams.bedrooms === "string" ? resolvedParams.bedrooms : undefined,
        priceRange: typeof resolvedParams.price === "string" ? resolvedParams.price : undefined,
        location: typeof resolvedParams.location === "string" ? resolvedParams.location : undefined,
        sort: typeof resolvedParams.sort === "string" ? resolvedParams.sort : undefined,
        page: 1,
        limit: 3,
    };

    const { data: properties, total } = await listProperties(filters);
    
    const propertyTypes = await prisma.propertyType.findMany({
        orderBy: { name: "asc" },
    });

    const mappedProperties = properties.map(mapPropertyToCard);

    return (
        <div className="min-h-screen">
            <Header />

            <PropertyFilters
                propertyTypes={propertyTypes}
                forcedListingType={forcedListingType}
            />

            <PropertyBreadcrumb />

            <PropertyHeader
                propertyCount={total}
            />

            {/* Properties Grid */}
            <section className="pb-16">
                <div className="container mx-auto px-4">
                    <PropertiesListWithLoadMore 
                        initialProperties={mappedProperties} 
                        initialTotal={total}
                        filters={filters}
                    />
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PropertyListings;
