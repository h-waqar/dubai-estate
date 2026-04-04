/*
  Warnings:

  - You are about to drop the column `maxFeaturedListings` on the `PricingPlan` table. All the data in the column will be lost.
  - You are about to drop the column `maxListings` on the `PricingPlan` table. All the data in the column will be lost.
  - Added the required column `name` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `EntitlementDefinition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `EntitlementGrant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EntitlementDefinition" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EntitlementGrant" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PricingPlan" DROP COLUMN "maxFeaturedListings",
DROP COLUMN "maxListings";
