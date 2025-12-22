-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "aboutContent" TEXT,
ADD COLUMN     "locationDescription" TEXT,
ADD COLUMN     "tagline" TEXT;

-- CreateTable
CREATE TABLE "ProjectFeature" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL DEFAULT 'AMENITY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectProgress" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "milestone" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectFeature_projectId_idx" ON "ProjectFeature"("projectId");

-- CreateIndex
CREATE INDEX "ProjectFeature_category_idx" ON "ProjectFeature"("category");

-- CreateIndex
CREATE INDEX "ProjectProgress_projectId_idx" ON "ProjectProgress"("projectId");

-- CreateIndex
CREATE INDEX "ProjectProgress_order_idx" ON "ProjectProgress"("order");

-- AddForeignKey
ALTER TABLE "ProjectFeature" ADD CONSTRAINT "ProjectFeature_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectProgress" ADD CONSTRAINT "ProjectProgress_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
