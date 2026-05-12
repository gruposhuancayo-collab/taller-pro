/*
  Warnings:

  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Orden` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Orden" DROP CONSTRAINT "Orden_clienteId_fkey";

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "Orden";

-- DropEnum
DROP TYPE "EstadoOrden";

-- DropEnum
DROP TYPE "EstadoPago";

-- CreateTable
CREATE TABLE "cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "celular" TEXT NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "producto" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT,
    "serie" TEXT,
    "problema" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "reparacion" TEXT,
    "precio" DOUBLE PRECISION,
    "tipoPago" TEXT,
    "motivoNoReparado" TEXT,
    "enGarantia" BOOLEAN NOT NULL DEFAULT false,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaGarantia" TIMESTAMP(3),
    "deuda" DOUBLE PRECISION DEFAULT 0,
    "recibo" INTEGER DEFAULT 0,
    "fotos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "metodo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingresoExtra" (
    "id" SERIAL NOT NULL,
    "detalle" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingresoExtra_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orden" ADD CONSTRAINT "orden_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "orden"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
