import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrdenDetalle({
  params,
}: any) {

  const resolvedParams =
    await params;

  const id = Number(
    resolvedParams.id
  );

  if (!id || isNaN(id)) {
    return notFound();
  }

  const orden =
    await prisma.orden.findUnique({
      where: { id },
      include: {
        cliente: true,
        pagos: true,
      },
    });

  if (!orden) {
    return notFound();
  }

  const totalPagado =
    orden.pagos?.reduce(
      (acc, p) => acc + p.monto,
      0
    ) || 0;

  const deuda =
    (orden.precio || 0) -
    totalPagado;

  const telefono =
    orden.cliente?.celular || "";

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
        color: "white",
      }}
    >

      {/* HEADER */}
      <div
        style={{
          background: "#111827",
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
          border: "1px solid #374151",
        }}
      >
        <h1
          style={{
            fontSize: 32,
            marginBottom: 10,
          }}
        >
          🧾 Orden #{orden.codigo}
        </h1>

        <div
          style={{
            fontSize: 18,
            lineHeight: 1.8,
          }}
        >
          <div>
            <strong>Cliente:</strong>{" "}
            {orden.cliente.nombre}
          </div>

          <div>
            <strong>Producto:</strong>{" "}
            {orden.producto}
          </div>

          <div>
            <strong>Marca:</strong>{" "}
            {orden.marca}
          </div>

          <div>
            <strong>Modelo:</strong>{" "}
            {orden.modelo || "-"}
          </div>

          <div>
            <strong>Serie:</strong>{" "}
            {orden.serie || "-"}
          </div>

          <div>
            <strong>Estado:</strong>{" "}
            {orden.estado}
          </div>

          <div>
            <strong>Precio:</strong>{" "}
            S/ {orden.precio || 0}
          </div>

          <div>
            <strong>Pagado:</strong>{" "}
            S/ {totalPagado}
          </div>

          <div>
            <strong>Deuda:</strong>{" "}
            S/ {deuda}
          </div>
        </div>
      </div>

      {/* BOTONES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >

        {/* REENVIAR */}
        {telefono && (
          <a
            href={`https://wa.me/51${telefono}`}
            target="_blank"
          >
            <button
              style={{
                width: "100%",
                background: "#16a34a",
                color: "white",
                padding: 16,
                border: "none",
                borderRadius: 12,
                fontWeight: "bold",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              🟢 WhatsApp
            </button>
          </a>
        )}

        {/* LISTO */}
        <button
          onClick={() => {

            const reparacion =
              prompt(
                "¿Qué reparación se realizó?"
              );

            if (!reparacion) return;

            const precio =
              prompt(
                "¿Cuánto costará?"
              );

            if (!precio) return;

            const mensaje =
`🛠️ SHINHWA REPAIR

Hola ${orden.cliente.nombre} 👋

Tu equipo ya está LISTO ✅

🔧 Reparación:
${reparacion}

💰 Total:
S/ ${precio}

📍 Puedes pasar a recogerlo.

Gracias 🔧`;

            window.open(
              `https://wa.me/51${telefono}?text=${encodeURIComponent(mensaje)}`,
              "_blank"
            );

            fetch(
              `/api/orden/${orden.id}/estado`,
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  estado: "LISTO",
                  reparacion,
                  precio:
                    Number(precio),
                }),
              }
            ).then(() => {
              location.reload();
            });

          }}
          style={{
            width: "100%",
            background: "#2563eb",
            color: "white",
            padding: 16,
            border: "none",
            borderRadius: 12,
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          ✅ Marcar LISTO
        </button>

        {/* NO REPARADO */}
        <button
          onClick={() => {

            const motivo =
              prompt(
                "¿Por qué no se pudo reparar?"
              );

            if (!motivo) return;

            const mensaje =
`Hola ${orden.cliente.nombre} 👋

No se pudo reparar el equipo ❌

Motivo:
${motivo}

SHINHWA REPAIR`;

            window.open(
              `https://wa.me/51${telefono}?text=${encodeURIComponent(mensaje)}`,
              "_blank"
            );

            fetch(
              `/api/orden/${orden.id}/estado`,
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  estado:
                    "NO REPARADO",
                  motivo,
                }),
              }
            ).then(() => {
              location.reload();
            });

          }}
          style={{
            width: "100%",
            background: "#dc2626",
            color: "white",
            padding: 16,
            border: "none",
            borderRadius: 12,
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          ❌ No reparado
        </button>

      </div>

      {/* PROBLEMA */}
      <div
        style={{
          background: "#111827",
          padding: 20,
          borderRadius: 16,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            marginBottom: 10,
          }}
        >
          ⚠️ Problema
        </h2>

        <div
          style={{
            fontSize: 18,
            whiteSpace: "pre-wrap",
          }}
        >
          {orden.problema}
        </div>
      </div>

    </div>
  );
}
