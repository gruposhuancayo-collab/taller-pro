-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('RECIBIDO', 'DIAGNOSTICO', 'REPARACION', 'LISTO', 'ENTREGADO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'PARCIAL', 'PAGADO', 'CREDITO');

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "dni" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orden" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "producto" TEXT NOT NULL DEFAULT 'Laptop',
    "marca" TEXT NOT NULL,
    "modelo" TEXT,
    "serie" TEXT,
    "estado" "EstadoOrden" NOT NULL DEFAULT 'RECIBIDO',
    "estadoPago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "precio" DOUBLE PRECISION,
    "pagado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orden_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_dni_key" ON "Cliente"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Orden_codigo_key" ON "Orden"("codigo");

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
