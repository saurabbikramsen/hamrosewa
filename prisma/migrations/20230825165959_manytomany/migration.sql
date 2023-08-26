/*
  Warnings:

  - You are about to drop the column `userId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `booking_userId_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `booking_vendorId_fkey`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `userId`,
    DROP COLUMN `vendorId`;

-- CreateTable
CREATE TABLE `_bookingTouser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_bookingTouser_AB_unique`(`A`, `B`),
    INDEX `_bookingTouser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_bookingTovendor` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_bookingTovendor_AB_unique`(`A`, `B`),
    INDEX `_bookingTovendor_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_bookingTouser` ADD CONSTRAINT `_bookingTouser_A_fkey` FOREIGN KEY (`A`) REFERENCES `booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_bookingTouser` ADD CONSTRAINT `_bookingTouser_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_bookingTovendor` ADD CONSTRAINT `_bookingTovendor_A_fkey` FOREIGN KEY (`A`) REFERENCES `booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_bookingTovendor` ADD CONSTRAINT `_bookingTovendor_B_fkey` FOREIGN KEY (`B`) REFERENCES `vendor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
