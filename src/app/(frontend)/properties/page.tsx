import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyBreadcrumb from "@/components/properties/PropertyBreadcrumb";
import PropertyHeader from "@/components/properties/PropertyHeader";
import { listProperties } from "@/modules/property/services/listProperties";
import { prisma } from "@/lib/prisma";

interface PropertiesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Properties = async ({ searchParams }: PropertiesPageProps) => {
  const resolvedParams = await searchParams;
  const filters = {
    searchQuery: typeof resolvedParams.search === "string" ? resolvedParams.search : undefined,
    propertyStatus: typeof resolvedParams.status === "string" ? resolvedParams.status : undefined,
    propertyType: typeof resolvedParams.type === "string" ? resolvedParams.type : undefined,
    bedrooms: typeof resolvedParams.bedrooms === "string" ? resolvedParams.bedrooms : undefined,
    priceRange: typeof resolvedParams.price === "string" ? resolvedParams.price : undefined,
  };

  const properties = await listProperties(filters);
  const propertyTypes = await prisma.propertyType.findMany({
    orderBy: { name: "asc" },
  });

  const mappedProperties = properties.map((p) => {
    // Determine the primary image URL
    let imageUrl = p.images[0]?.url;
    
    // If no direct image, check media usages (prefer COVER)
    if (!imageUrl && p.mediaUsages?.length > 0) {
      const cover = p.mediaUsages.find((mu) => mu.role === "COVER");
      imageUrl = cover ? cover.media.url : p.mediaUsages[0].media.url;
    }

    // Process the URL to ensure it has the correct path
    const finalImage = imageUrl
      ? (imageUrl.startsWith("http") || imageUrl.startsWith("/")
          ? imageUrl
          : `/uploads/${encodeURIComponent(imageUrl)}`)
      : "/assets/nopropertyfound.jpg";
      // : "/assets/placeholder.jpg";

    return {
      id: p.id,
      slug: p.slug,
      image: finalImage,
      alt: p.title,
      title: p.title,
      location: p.location,
      price: `${p.currency} ${p.price.toString()}`,
    bedrooms: p.bedrooms || 0,
    bathrooms: p.bathrooms || 0,
    area: `${p.builtUpArea || 0} ${p.areaUnit || "sqft"}`,
    type: p.propertyType?.name || "Unknown",
    featured: false, // TODO: Add featured flag to DB
    ref: p.refNo || "",
    status: p.availability === "OFFPLAN" ? "Offplan" : "Ready",
    };
  });

  return (
    <div className="min-h-screen">
      <Header />

      <PropertyFilters propertyTypes={propertyTypes} />

      <PropertyBreadcrumb />

      <PropertyHeader
        propertyCount={mappedProperties.length}
      />

      {/* Properties Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mappedProperties.map((property) => (
              <PropertyCard key={property.id} property={property as any} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8">
              Load More Properties
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
