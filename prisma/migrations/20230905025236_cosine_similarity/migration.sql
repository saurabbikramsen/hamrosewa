-- CreateTable
CREATE TABLE "ProfileViews" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "userId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "ProfileViews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimilarUser" (
    "id" SERIAL NOT NULL,
    "mainUserId" INTEGER NOT NULL,

    CONSTRAINT "SimilarUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SimilarUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileViews_userId_vendorId_key" ON "ProfileViews"("userId", "vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "SimilarUser_mainUserId_key" ON "SimilarUser"("mainUserId");

-- CreateIndex
CREATE UNIQUE INDEX "_SimilarUser_AB_unique" ON "_SimilarUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SimilarUser_B_index" ON "_SimilarUser"("B");

-- CreateIndex
CREATE INDEX "user_id_email_idx" ON "user"("id", "email");

-- CreateIndex
CREATE INDEX "vendor_id_email_idx" ON "vendor"("id", "email");

-- AddForeignKey
ALTER TABLE "ProfileViews" ADD CONSTRAINT "ProfileViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileViews" ADD CONSTRAINT "ProfileViews_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimilarUser" ADD CONSTRAINT "SimilarUser_mainUserId_fkey" FOREIGN KEY ("mainUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SimilarUser" ADD CONSTRAINT "_SimilarUser_A_fkey" FOREIGN KEY ("A") REFERENCES "SimilarUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SimilarUser" ADD CONSTRAINT "_SimilarUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
