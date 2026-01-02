
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function checkViews() {
  const properties = await prisma.property.findMany({
    select: { id: true, title: true, views: true },
  });
  console.log("Current Property Views:", properties);
}

checkViews()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
