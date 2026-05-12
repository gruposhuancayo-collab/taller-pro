import { prisma } from "@/lib/prisma";

export default async function Deudores() {
  const deudores = await prisma.orden.findMany({
    where: {
      deuda: {
        gt: 0,
      },
    },
    include: {
      cliente: true,
    },
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>💳 Deudores</h1>

      {deudores.map((o) => (
        <div
          key={o.id}
          style={{
            background: "#fff",
            padding: 15,
            marginTop: 10,
            borderRadius: 8,
          }}
        >
          <p><b>{o.cliente.nombre}</b></p>
          <p>📱 {o.cliente.celular}</p>
          <p>💰 Debe: S/ {o.deuda}</p>

          <a
            href={`https://wa.me/51${o.cliente.celular}?text=${encodeURIComponent(
              `Hola ${o.cliente.nombre}, tienes una deuda pendiente de S/ ${o.deuda}. Te esperamos 👍`
            )}`}
            target="_blank"
          >
            <button style={{ marginTop: 5 }}>
              📲 Recordar por WhatsApp
            </button>
          </a>
        </div>
      ))}
    </div>
  );
}