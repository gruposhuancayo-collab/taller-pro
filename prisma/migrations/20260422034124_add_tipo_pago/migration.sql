/*
  Warnings:

  - A unique constraint covering the columns `[numeroTicket]` on the table `Orden` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Orden" ADD COLUMN     "fotos" TEXT[],
ADD COLUMN     "numeroTicket" INTEGER,
ADD COLUMN     "tipoPago" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Orden_numeroTicket_key" ON "Orden"("numeroTicket");
