import { prisma } from "@/lib/prisma";
import { GovernanceService } from "@/modules/governance/governance.service";
import FeaturedProperties from "./FeaturedProperties";
import { Property } from "@/types/featured-properties";

export async function FeaturedPropertiesSection() {
    // 1. Fetch Spotlight Properties
    const properties = await prisma.property.findMany({
        where: {
            ...GovernanceService.getPublicFilter(),
            promotions: {
                some: {
                    type: "SPOTLIGHT",
                    status: "ACTIVE",
                    expiresAt: { gt: new Date() }
                }
            }
        },
        take: 10,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            propertyType: true,
            promotions: {
                where: {
                    status: "ACTIVE",
                    expiresAt: { gt: new Date() }
                }
            },
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
        const spotlightPromo = p.promotions.find(promo => promo.type === "SPOTLIGHT");

        return {
            id: p.id,
            image: coverImage,
            alt: p.title,
            featured: p.isFeatured,
            promotionType: spotlightPromo ? "SPOTLIGHT" : (p.promotions[0]?.type as any),
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
