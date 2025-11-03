/*
  Warnings:

  - You are about to drop the column `coverImageId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_coverImageId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "coverImageId",
ADD COLUMN     "coverImage" TEXT;
