/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `interaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `interaction_type` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,

    UNIQUE INDEX `interaction_id_key`(`id`),
    UNIQUE INDEX `interaction_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `booking_userId_key` ON `booking`(`userId`);

-- AddForeignKey
ALTER TABLE `interaction` ADD CONSTRAINT `interaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interaction` ADD CONSTRAINT `interaction_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
