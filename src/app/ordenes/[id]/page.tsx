import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrdenDetalle({ params }: any) {
  const resolvedParams = await params;

  const id = Number(resolvedParams.id);

  if (!id || isNaN(id)) {
    return notFound();
  }

  const orden = await prisma.orden.findUnique({
    where: { id },
    include: {
      cliente: true,
    },
  });

  if (!orden) {
    return notFound();
  }

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

        <div style={{ fontSize: 18, lineHeight: 1.8 }}>
          <div>
            <strong>Cliente:</strong> {orden.cliente.nombre}
          </div>

          <div>
            <strong>DNI:</strong> {orden.cliente.dni}
          </div>

          <div>
            <strong>Celular:</strong> {orden.cliente.celular}
          </div>

          <div>
            <strong>Producto:</strong> {orden.producto}
          </div>

          <div>
            <strong>Marca:</strong> {orden.marca}
          </div>

          <div>
            <strong>Modelo:</strong> {orden.modelo || "-"}
          </div>

          <div>
            <strong>Serie:</strong> {orden.serie || "-"}
          </div>

          <div>
            <strong>Estado:</strong> {orden.estado}
          </div>
        </div>
      </div>

      {/* PROBLEMA */}
      <div
        style={{
          background: "#111827",
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
          border: "1px solid #374151",
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
            lineHeight: 1.6,
          }}
        >
          {orden.problema}
        </div>
      </div>

      {/* GALERÍA */}
      <div
        style={{
          background: "#111827",
          padding: 20,
          borderRadius: 16,
          border: "1px solid #374151",
        }}
      >
        <h2
          style={{
            fontSize: 26,
            marginBottom: 20,
          }}
        >
          📸 Fotos del equipo
        </h2>

        {!orden.fotos || orden.fotos.length === 0 ? (
          <div
            style={{
              fontSize: 18,
              opacity: 0.7,
            }}
          >
            No hay fotos registradas
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: 20,
            }}
          >
            {orden.fotos.map((foto: string, index: number) => (
              <div
                key={index}
                style={{
                  background: "#1f2937",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #374151",
                }}
              >
                <a
                  href={foto}
                  target="_blank"
                >
                  <img
                    src={foto}
                    alt={`foto-${index}`}
                    style={{
                      width: "100%",
                      height: 250,
                      objectFit: "cover",
                      display: "block",
                      cursor: "zoom-in",
                    }}
                  />
                </a>

                <div
                  style={{
                    padding: 12,
                  }}
                >
                  <a
                    href={foto}
                    target="_blank"
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: "#2563eb",
                      color: "white",
                      padding: 12,
                      borderRadius: 10,
                      textDecoration: "none",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    🔍 Ver foto completa
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTÓN */}
      <div
        style={{
          marginTop: 30,
        }}
      >
        <a
          href="/ordenes"
          style={{
            display: "block",
            width: "100%",
            textAlign: "center",
            background: "#16a34a",
            padding: 18,
            borderRadius: 14,
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          ← Volver a órdenes
        </a>
      </div>
    </div>
  );
}