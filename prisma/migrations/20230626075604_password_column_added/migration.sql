-- AlterTable
ALTER TABLE `user` ADD COLUMN `password` VARCHAR(191) NOT NULL DEFAULT 'hello';

-- AlterTable
ALTER TABLE `vendor` ADD COLUMN `password` VARCHAR(191) NOT NULL DEFAULT 'hi';
