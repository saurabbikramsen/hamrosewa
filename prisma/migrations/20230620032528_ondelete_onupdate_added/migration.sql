-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `vendor` DROP FOREIGN KEY `vendor_locationId_fkey`;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendor` ADD CONSTRAINT `vendor_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
