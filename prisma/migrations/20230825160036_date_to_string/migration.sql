/*
  Warnings:

  - A unique constraint covering the columns `[serviceId]` on the table `interaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `booking` MODIFY `booked_date` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `interaction_serviceId_key` ON `interaction`(`serviceId`);
