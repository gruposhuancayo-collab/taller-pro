import { prisma } from "@/lib/prisma";

export default async function Recordatorios() {
  // 🔥 agrupar por cliente
  const data = await prisma.orden.groupBy({
    by: ["clienteId"],
    _sum: {
      deuda: true,
    },
    where: {
      deuda: {
        gt: 0,
      },
    },
  });

  // traer datos del cliente
  const clientes = await prisma.cliente.findMany({
    where: {
      id: {
        in: data.map((d) => d.clienteId),
      },
    },
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>📲 Recordar deudas (agrupado)</h1>

      {data.length === 0 && <p>No hay deudores 👍</p>}

      {data.map((d) => {
        const cliente = clientes.find((c) => c.id === d.clienteId);

        if (!cliente) return null;

        const deudaTotal = d._sum.deuda || 0;

        const msg = `Hola ${cliente.nombre}, tienes una deuda total de S/ ${deudaTotal}. Te esperamos 👍`;

        const link = `https://wa.me/51${cliente.celular}?text=${encodeURIComponent(msg)}`;

        return (
          <div
            key={cliente.id}
            style={{
              background: "#fff",
              padding: 15,
              marginTop: 10,
              borderRadius: 8,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <p><b>{cliente.nombre}</b></p>
            <p>📱 {cliente.celular}</p>
            <p style={{ fontSize: 18 }}>
              💰 Deuda total: <b>S/ {deudaTotal}</b>
            </p>

            <a href={link} target="_blank">
              <button
                style={{
                  marginTop: 10,
                  background: "#25D366",
                  color: "white",
                  padding: 10,
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                📲 Recordar deuda total
              </button>
            </a>
          </div>
        );
      })}
    </div>
  );
}