/*
  Warnings:

  - Made the column `description` on table `booking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "booking" ALTER COLUMN "description" SET NOT NULL;
