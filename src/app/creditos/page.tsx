import { prisma } from "@/lib/prisma";

export default async function CreditosPage() {
  const deudores = await prisma.orden.findMany({
    where: {
      deuda: {
        gt: 0,
      },
    },
    include: { cliente: true },
    orderBy: { id: "desc" },
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>💳 Clientes con deuda</h1>

      {deudores.length === 0 && <p>No hay deudas</p>}

      {deudores.map((o) => (
        <div
          key={o.id}
          style={{
            background: "#fff",
            padding: 15,
            marginTop: 10,
            borderRadius: 10,
            borderLeft: "5px solid red",
          }}
        >
          <p><b>{o.cliente.nombre}</b></p>
          <p>Equipo: {o.marca}</p>
          <p>Deuda: S/ {o.deuda}</p>
        </div>
      ))}
    </div>
  );
}