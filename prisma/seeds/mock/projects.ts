import { PrismaClient, ProjectType, ProjectStatus } from "@prisma/client";

export async function seedProjects(prisma: PrismaClient) {
  console.log("⏳ Seeding Mock Projects...");
  
  const admin = await prisma.user.findFirst({
    where: { roles: { has: "SUPER_ADMIN" } },
  });

  const shadowAgent = await prisma.user.findFirst({
    where: { username: "shadow_agent_01" },
  });

  if (!admin || !shadowAgent) {
    console.warn("   ⚠️ No Super Admin or Shadow Agent found, skipping projects.");
    return;
  }

  const emaar = await prisma.developer.findUnique({ where: { slug: "emaar" } });
  if (emaar) {
    const existingProject = await prisma.project.findUnique({
      where: { slug: "creek-waters" },
    });
    if (!existingProject) {
      await prisma.project.create({
        data: {
          name: "Creek Waters",
          slug: "creek-waters",
          description: "Luxury living on Creek Island.",
          developerId: emaar.id,
          createdById: admin.id,
          projectType: ProjectType.CURRENT,
          status: ProjectStatus.APPROVED,
          isFeatured: true,
          published: true,
          publishedAt: new Date(),
          location: "Dubai Creek Harbour",
          priceFrom: "1500000",
          amenities: {
            connect: [{ name: "Infinity Pool" }, { name: "Concierge" }],
          },
        },
      });
      console.log("   ✅ Project: Creek Waters");
    }

    // Shadow Tower
    const shadowTower = await prisma.project.upsert({
      where: { slug: "shadow-tower" },
      update: {},
      create: {
        name: "Shadow Tower",
        slug: "shadow-tower",
        description: "The ultimate off-plan project for shadow agents.",
        developerId: emaar.id,
        createdById: shadowAgent.id,
        projectType: ProjectType.CURRENT,
        status: ProjectStatus.APPROVED,
        location: "Downtown Dubai",
        priceFrom: "2000000",
      },
    });
    console.log(`   ✅ Project: ${shadowTower.slug}`);
  }
}
