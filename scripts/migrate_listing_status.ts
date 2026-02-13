import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function migrate() {
  console.log("Starting migration of Property and Project statuses...");

  // Migrate Properties
  const properties = await prisma.property.findMany();
  console.log(`Found ${properties.length} properties to migrate.`);

  let propertyCount = 0;
  for (const property of properties) {
    let editorialStatus = "DRAFT";
    let moderationStatus = "PENDING_REVIEW";
    let systemStatus = "ACTIVE";

    if (property.published) {
      editorialStatus = "SUBMITTED";
      moderationStatus = "APPROVED";
    } else if (property.status === "PENDING_REVIEW") {
      editorialStatus = "SUBMITTED";
      moderationStatus = "PENDING_REVIEW";
    } else if (property.status === "ARCHIVED") {
      editorialStatus = "ARCHIVED";
    } else if (property.status === "DECLINED") {
      editorialStatus = "SUBMITTED";
      moderationStatus = "REJECTED";
    }

    await prisma.property.update({
      where: { id: property.id },
      data: {
        editorialStatus: editorialStatus as any,
        moderationStatus: moderationStatus as any,
        systemStatus: systemStatus as any,
      },
    });
    propertyCount++;
  }
  console.log(`Migrated ${propertyCount} properties.`);

  // Migrate Projects
  const projects = await prisma.project.findMany();
  console.log(`Found ${projects.length} projects to migrate.`);

  let projectCount = 0;
  for (const project of projects) {
    let editorialStatus = "DRAFT";
    let moderationStatus = "PENDING_REVIEW";
    let systemStatus = "ACTIVE";

    if (project.published) {
      editorialStatus = "SUBMITTED";
      moderationStatus = "APPROVED";
    } else if (project.status === "PENDING_REVIEW") {
      editorialStatus = "SUBMITTED";
      moderationStatus = "PENDING_REVIEW";
    } else if (project.status === "ARCHIVED") {
      editorialStatus = "ARCHIVED";
    } else if (project.status === "DECLINED") {
      editorialStatus = "SUBMITTED";
      moderationStatus = "REJECTED";
    }

    await prisma.project.update({
      where: { id: project.id },
      data: {
        editorialStatus: editorialStatus as any,
        moderationStatus: moderationStatus as any,
        systemStatus: systemStatus as any,
      },
    });
    projectCount++;
  }
  console.log(`Migrated ${projectCount} projects.`);

  console.log("Migration complete!");
}

migrate()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
