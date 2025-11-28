
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const counts = await prisma.property.groupBy({
    by: ['listingType'],
    _count: {
      listingType: true,
    },
  });
  console.log('Property counts by listingType:', counts);

  const offPlanProps = await prisma.property.findMany({
    where: { listingType: 'OFF_PLAN' },
    select: { id: true, title: true, listingType: true }
  });
  console.log('Off-plan properties:', offPlanProps);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
