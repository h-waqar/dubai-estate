import { prisma } from "@/lib/prisma";
import { GovernanceService } from "@/modules/governance/governance.service";
import { serializeDecimals } from "@/lib/serializeDecimal";
import { FeaturedProjectGrid } from "./FeaturedProjectGrid";

export async function FeaturedProjectsSection() {
    // 1. Fetch Projects
    const projects = await prisma.project.findMany({
        where: {
            ...GovernanceService.getPublicFilter(),
        },
        take: 15,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            developer: {
                select: {
                    name: true,
                    logo: true,
                }
            },
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

    // 3. Attach media to projects
    const serializedProjects = projects.map((project: any) => ({
        ...project,
        mediaUsages: mediaUsages.filter((mu: { entityId: number }) => mu.entityId === project.id),
    }));

    // 4. Serialize Decimals (for Client Component)
    const plainProjects = serializeDecimals(serializedProjects);

    return <FeaturedProjectGrid projects={plainProjects} />;
}
