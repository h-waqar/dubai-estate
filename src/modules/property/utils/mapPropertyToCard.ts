import { PropertyCardProps } from "@/types/sections";

export function mapPropertyToCard(p: any): PropertyCardProps["property"] {
  // Determine the primary image URL
  let imageUrl = p.images?.[0]?.url;

  // If no direct image, check media usages (prefer COVER)
  if (!imageUrl && p.mediaUsages?.length > 0) {
    const cover = p.mediaUsages.find((mu: any) => mu.role === "COVER");
    imageUrl = cover ? cover.media.url : p.mediaUsages[0].media.url;
  }

  // Process the URL to ensure it has the correct path
  const finalImage = imageUrl
    ? (imageUrl.startsWith("http") || imageUrl.startsWith("/")
      ? imageUrl
      : `/uploads/${encodeURIComponent(imageUrl)}`)
    : "/assets/images/nopropertyfound.jpg";

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
    featured: p.isFeatured,
    promotionType: p.promotions?.some((promo: any) => promo.type === "SPOTLIGHT") 
      ? "SPOTLIGHT" 
      : (p.promotions?.some((promo: any) => promo.type === "FEATURED") ? "FEATURED" : undefined),
    ref: p.refNo || "",
    status: p.availability === "OFFPLAN" ? "Offplan" : "Ready",
  };
}
