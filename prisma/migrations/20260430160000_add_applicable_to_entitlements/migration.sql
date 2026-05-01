-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('PROPERTY', 'PROJECT', 'ALL');

-- AlterTable
ALTER TABLE "EntitlementDefinition" ADD COLUMN "applicableTo" "EntityType" NOT NULL DEFAULT 'PROPERTY';
