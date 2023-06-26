/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `booking_id_key` ON `booking`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `location_id_key` ON `location`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `user_id_key` ON `user`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `vendor_id_key` ON `vendor`(`id`);
