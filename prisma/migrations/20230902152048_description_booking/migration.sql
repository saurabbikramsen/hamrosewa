/*
  Warnings:

  - Made the column `amount` on table `payment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "amount" SET DEFAULT 0;
