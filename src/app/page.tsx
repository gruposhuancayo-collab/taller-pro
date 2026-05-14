import { prisma } from "@/lib/prisma";
import IngresoExtraBtn from "./IngresoExtraBtn";
import Link from "next/link";

export default async function Dashboard() {
  const totalOrdenes = await prisma.orden.count();

  const ingresosOrdenes = await prisma.orden.aggregate({
    _sum: { precio: true },
    where: {
      tipoPago: { not: "CREDITO" },
    },
  });

  const pagos = await prisma.pago.aggregate({
    _sum: { monto: true },
  });

  const extras = await prisma.ingresoExtra.aggregate({
    _sum: { monto: true },
  });

  const ingresosTotales =
    (ingresosOrdenes._sum.precio || 0) +
    (pagos._sum.monto || 0) +
    (extras._sum.monto || 0);

  const pendientes = await prisma.orden.count({
    where: { estado: "REPARACION" },
  });

  const creditos = await prisma.orden.aggregate({
    _sum: { deuda: true },
  });

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28 }}>📊 Dashboard</h1>

      <IngresoExtraBtn />

      <Link href="/placas">
        <button
          style={{
            padding: 20,
            borderRadius: 12,
            border: "none",
            background: "#7c3aed",
            color: "white",
            fontSize: 18,
            cursor: "pointer",
            width: "100%",
            marginTop: 15,
          }}
        >
          📦 Placas en Stock
        </button>
      </Link>

      <div style={{ display: "grid", gap: 15, marginTop: 20 }}>
        <Card title="Órdenes" value={totalOrdenes} color="#2563eb" />

        <Card
          title="💰 Ingresos reales"
          value={`S/ ${ingresosTotales}`}
          color="#16a34a"
        />

        <Card
          title="Pendientes"
          value={pendientes}
          color="#f59e0b"
        />

        <Card
          title="💳 Créditos"
          value={`S/ ${creditos._sum.deuda || 0}`}
          color="#dc2626"
        />
      </div>
    </div>
  );
}

function Card({ title, value, color }: any) {
  return (
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 10,
        borderLeft: `6px solid ${color}`,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <p style={{ color: "#6b7280" }}>{title}</p>
      <h2 style={{ fontSize: 24 }}>{value}</h2>
    </div>
  );
}