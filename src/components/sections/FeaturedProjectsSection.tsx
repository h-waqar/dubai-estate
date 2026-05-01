import { prisma } from "@/lib/prisma";
import { GovernanceService } from "@/modules/governance/governance.service";
import { serializeDecimals } from "@/lib/serializeDecimal";
import { FeaturedProjectGrid } from "./FeaturedProjectGrid";

export async function FeaturedProjectsSection() {
    // 1. Fetch Projects (Prioritize Spotlight)
    const projects = await prisma.project.findMany({
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
        take: 15,
        orderBy: [
            { createdAt: "desc" }
        ],
        include: {
            developer: {
                select: {
                    name: true,
                    logo: true,
                }
            },
            promotions: {
                where: {
                    status: "ACTIVE",
                    expiresAt: { gt: new Date() }
                }
            }
        },
    });

    // 2. Fetch Media Usages separately
    const projectIds = projects.map(p => p.id);
    const mediaUsages = await prisma.mediaUsage.findMany({
        where: {
            entityType: "PROJECT",
            entityId: { in: projectIds },
            role: "COVER",
        },
        include: {
            media: {
                select: {
                    url: true,
                }
            }
        }
    });

    // 3. Attach media and promotion info to projects
    const serializedProjects = projects.map((project: any) => {
        const isSpotlight = project.promotions?.some((p: any) => p.type === "SPOTLIGHT");
        
        return {
            ...project,
            isSpotlight,
            isFeatured: project.isFeatured || project.promotions?.some((p: any) => p.type === "FEATURED"),
            mediaUsages: mediaUsages.filter((mu: { entityId: number }) => mu.entityId === project.id),
        };
    });

    // 4. Sort: Spotlight first (all are spotlight anyway based on query, but keeping for stability)
    serializedProjects.sort((a: any, b: any) => {
        if (a.isSpotlight && !b.isSpotlight) return -1;
        if (!a.isSpotlight && b.isSpotlight) return 1;
        return 0;
    });

    // 5. Serialize Decimals (for Client Component)
    const plainProjects = serializeDecimals(serializedProjects);

    return <FeaturedProjectGrid projects={plainProjects} />;
}
