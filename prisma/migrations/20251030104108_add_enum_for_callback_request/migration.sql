/*
  Warnings:

  - Changed the type of `contactMethod` on the `CallbackRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('Phone', 'Email');

-- AlterTable
ALTER TABLE "CallbackRequest" DROP COLUMN "contactMethod",
ADD COLUMN     "contactMethod" "ContactMethod" NOT NULL;
