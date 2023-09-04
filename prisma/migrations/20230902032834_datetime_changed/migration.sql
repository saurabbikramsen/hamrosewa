/*
  Warnings:

  - Changed the type of `booked_date` on the `booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "admin" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "booking" ALTER COLUMN "updatedAt" DROP DEFAULT,
DROP COLUMN "booked_date",
ADD COLUMN     "booked_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "interaction" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "services" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "vendor" ALTER COLUMN "updatedAt" DROP DEFAULT;
