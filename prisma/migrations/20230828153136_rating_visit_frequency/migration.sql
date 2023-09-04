/*
  Warnings:

  - A unique constraint covering the columns `[contact]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contact]` on the table `vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "vendor" ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "visited_frequency" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "user_contact_key" ON "user"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_contact_key" ON "vendor"("contact");
