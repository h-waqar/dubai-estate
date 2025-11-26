
import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        images: true,
        mediaUsages: {
          include: {
            media: true
          }
        }
      },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log("Found properties:", properties.length);
    properties.forEach(p => {
      console.log(`Property ID: ${p.id}, Title: ${p.title}`);
      console.log(`Images count: ${p.images.length}`);
      p.images.forEach(img => {
        console.log(`  - Image URL: ${img.url}`);
      });
      console.log(`MediaUsages count: ${p.mediaUsages.length}`);
      p.mediaUsages.forEach(mu => {
        console.log(`  - Media URL: ${mu.media.url}`);
      });
    });

    const mediaUsageCount = await prisma.mediaUsage.count();
    console.log("Total MediaUsage records:", mediaUsageCount);
    const mediaCount = await prisma.media.count();
    const mediaUsages = await prisma.mediaUsage.findMany({
      take: 5,
      include: { media: true }
    });
    console.log("Sample MediaUsages:");
    mediaUsages.forEach(mu => {
      console.log(`  - Entity: ${mu.entityType} ID: ${mu.entityId}, Role: ${mu.role}, URL: ${mu.media.url}`);
    });

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
