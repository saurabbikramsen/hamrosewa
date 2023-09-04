-- CreateTable
CREATE TABLE "_paymentTovendor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_paymentTouser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_paymentTovendor_AB_unique" ON "_paymentTovendor"("A", "B");

-- CreateIndex
CREATE INDEX "_paymentTovendor_B_index" ON "_paymentTovendor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_paymentTouser_AB_unique" ON "_paymentTouser"("A", "B");

-- CreateIndex
CREATE INDEX "_paymentTouser_B_index" ON "_paymentTouser"("B");

-- AddForeignKey
ALTER TABLE "_paymentTovendor" ADD CONSTRAINT "_paymentTovendor_A_fkey" FOREIGN KEY ("A") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_paymentTovendor" ADD CONSTRAINT "_paymentTovendor_B_fkey" FOREIGN KEY ("B") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_paymentTouser" ADD CONSTRAINT "_paymentTouser_A_fkey" FOREIGN KEY ("A") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_paymentTouser" ADD CONSTRAINT "_paymentTouser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
