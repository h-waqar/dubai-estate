-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('SALE', 'RENT', 'OFF_PLAN');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('FUTURE', 'CURRENT', 'PAST');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'DECLINED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('STUDIO', 'ONE_BEDROOM', 'ONE_BEDROOM_STUDY', 'TWO_BEDROOM', 'TWO_BEDROOM_STUDY', 'THREE_BEDROOM', 'THREE_BEDROOM_MAID', 'FOUR_BEDROOM', 'PENTHOUSE', 'VILLA', 'TOWNHOUSE');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "listingType" "ListingType" NOT NULL DEFAULT 'SALE';

-- CreateTable
CREATE TABLE "Developer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Developer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "projectType" "ProjectType" NOT NULL DEFAULT 'CURRENT',
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "community" TEXT,
    "location" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "priceFrom" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "paymentPlanSummary" TEXT,
    "handoverDate" TIMESTAMP(3),
    "announcementDate" TIMESTAMP(3),
    "bookingOpenedDate" TIMESTAMP(3),
    "constructionStartDate" TIMESTAMP(3),
    "developerId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "approvedById" INTEGER,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectFloorplan" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "unitType" "UnitType" NOT NULL,
    "unitName" TEXT,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "size" DOUBLE PRECISION,
    "sizeUnit" TEXT DEFAULT 'sqft',
    "imageUrl" TEXT,
    "pdfUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectFloorplan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectAmenity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentPlanStage" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "percentage" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "triggerEvent" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentPlanStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NearbyAttraction" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "distance" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NearbyAttraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectFAQ" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectFAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToProjectAmenity" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProjectToProjectAmenity_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Developer_name_key" ON "Developer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Developer_slug_key" ON "Developer"("slug");

-- CreateIndex
CREATE INDEX "Developer_slug_idx" ON "Developer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_slug_idx" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_projectType_idx" ON "Project"("projectType");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_developerId_idx" ON "Project"("developerId");

-- CreateIndex
CREATE INDEX "Project_createdById_idx" ON "Project"("createdById");

-- CreateIndex
CREATE INDEX "ProjectFloorplan_projectId_idx" ON "ProjectFloorplan"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectAmenity_name_key" ON "ProjectAmenity"("name");

-- CreateIndex
CREATE INDEX "PaymentPlanStage_projectId_idx" ON "PaymentPlanStage"("projectId");

-- CreateIndex
CREATE INDEX "NearbyAttraction_projectId_idx" ON "NearbyAttraction"("projectId");

-- CreateIndex
CREATE INDEX "ProjectFAQ_projectId_idx" ON "ProjectFAQ"("projectId");

-- CreateIndex
CREATE INDEX "_ProjectToProjectAmenity_B_index" ON "_ProjectToProjectAmenity"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFloorplan" ADD CONSTRAINT "ProjectFloorplan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentPlanStage" ADD CONSTRAINT "PaymentPlanStage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NearbyAttraction" ADD CONSTRAINT "NearbyAttraction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFAQ" ADD CONSTRAINT "ProjectFAQ_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToProjectAmenity" ADD CONSTRAINT "_ProjectToProjectAmenity_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToProjectAmenity" ADD CONSTRAINT "_ProjectToProjectAmenity_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectAmenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
