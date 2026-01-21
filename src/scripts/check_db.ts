
import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const properties = await prisma.property.findMany({
    include: {
      images: true,
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
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
