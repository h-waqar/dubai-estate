-- CreateEnum
CREATE TYPE "EditorialStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SystemStatus" AS ENUM ('ACTIVE', 'INACTIVE_BILLING', 'INACTIVE_QUOTA');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "editorialStatus" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
ADD COLUMN     "systemStatus" "SystemStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "editorialStatus" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
ADD COLUMN     "systemStatus" "SystemStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "Project_editorialStatus_idx" ON "Project"("editorialStatus");

-- CreateIndex
CREATE INDEX "Project_moderationStatus_idx" ON "Project"("moderationStatus");

-- CreateIndex
CREATE INDEX "Project_systemStatus_idx" ON "Project"("systemStatus");

-- CreateIndex
CREATE INDEX "Property_editorialStatus_idx" ON "Property"("editorialStatus");

-- CreateIndex
CREATE INDEX "Property_moderationStatus_idx" ON "Property"("moderationStatus");

-- CreateIndex
CREATE INDEX "Property_systemStatus_idx" ON "Property"("systemStatus");
