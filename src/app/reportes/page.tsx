import { prisma } from "@/lib/prisma";

export default async function Reporte() {

  const inicio = new Date();
  inicio.setDate(1);
  inicio.setHours(0,0,0,0);

  const fin = new Date();

  // órdenes pagadas
  const ordenes = await prisma.orden.aggregate({
    _sum: { precio: true },
    where: {
      tipoPago: { not: "CREDITO" },
      createdAt: { gte: inicio, lte: fin },
    },
  });

  // pagos de deuda
  const pagos = await prisma.pago.aggregate({
    _sum: { monto: true },
    where: {
      createdAt: { gte: inicio, lte: fin },
    },
  });

  // ingresos extra
  const extras = await prisma.ingresoExtra.aggregate({
    _sum: { monto: true },
    where: {
      createdAt: { gte: inicio, lte: fin },
    },
  });

  const total =
    (ordenes._sum.precio || 0) +
    (pagos._sum.monto || 0) +
    (extras._sum.monto || 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>📅 Reporte mensual</h1>

      <div style={{ marginTop: 20 }}>
        <p>Órdenes: S/ {ordenes._sum.precio || 0}</p>
        <p>Pagos deuda: S/ {pagos._sum.monto || 0}</p>
        <p>Extras: S/ {extras._sum.monto || 0}</p>

        <h2>Total: S/ {total}</h2>
      </div>
    </div>
  );
}