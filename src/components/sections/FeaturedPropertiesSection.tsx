import { prisma } from "@/lib/prisma";
import { GovernanceService } from "@/modules/governance/governance.service";
import FeaturedProperties from "./FeaturedProperties";
import { Property } from "@/types/featured-properties";

export async function FeaturedPropertiesSection() {
    // 1. Fetch Featured Properties
    const properties = await prisma.property.findMany({
        where: {
            ...GovernanceService.getPublicFilter(),
            isFeatured: true,
        },
        take: 10,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            propertyType: true,
            mediaUsages: {
                where: {
                    role: "COVER",
                },
                include: {
                    media: true,
                },
                take: 1,
            },
        },
    });

    // 2. Transform to UI props
    const formattedProperties: Property[] = properties.map((p) => {
        const coverImage = p.mediaUsages[0]?.media?.url || "/assets/images/property-1.jpg";

        return {
            id: p.id,
            image: coverImage,
            alt: p.title,
            featured: p.isFeatured,
            type: p.propertyType.name,
            title: p.title,
            location: p.location,
            price: `AED ${Number(p.price).toLocaleString()}`,
            bedrooms: p.bedrooms || 0,
            bathrooms: p.bathrooms || 0,
            area: `${p.builtUpArea?.toLocaleString() || 0} sq ft`,
            slug: p.slug,
        };
    });

    return <FeaturedProperties properties={formattedProperties} />;
}
