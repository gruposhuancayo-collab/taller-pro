import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function OrdenesPage({ searchParams }: any) {

  // 🔍 BUSCADOR
  const q = searchParams?.q || "";

  const ordenes = await prisma.orden.findMany({
    where: {
      OR: [
        { codigo: { contains: q, mode: "insensitive" } },
        { marca: { contains: q, mode: "insensitive" } },
        { modelo: { contains: q, mode: "insensitive" } },
        { serie: { contains: q, mode: "insensitive" } },
        {
          cliente: {
            nombre: { contains: q, mode: "insensitive" },
          },
        },
      ],
    },
    include: { cliente: true },
    orderBy: { id: "desc" },
  });

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 28 }}>📋 Órdenes</h1>

        <Link href="/ordenes/nueva">
          <button
            style={{
              background: "#2563eb",
              color: "white",
              padding: "10px 15px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ➕ Nueva Orden
          </button>
        </Link>
      </div>

      {/* 🔍 BUSCADOR */}
      <form style={{ marginTop: 10 }}>
        <input
          name="q"
          placeholder="🔍 Buscar por cliente, serie, marca..."
          defaultValue={searchParams?.q || ""}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
      </form>

      {/* ✅ MENSAJE DE ÉXITO */}
      {searchParams?.ok && (
        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: 10,
            borderRadius: 6,
            marginTop: 10,
          }}
        >
          ✅ Orden creada correctamente
        </div>
      )}

      {/* LISTADO */}
      {ordenes.length === 0 ? (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            border: "1px dashed #ccc",
            borderRadius: 10,
            textAlign: "center",
            background: "#fafafa",
          }}
        >
          <p>No hay órdenes registradas</p>
        </div>
      ) : (
        <div style={{ marginTop: 20, display: "grid", gap: 15 }}>
          {ordenes.map((o) => (
            <div
              key={o.id}
              style={{
                background: "white",
                padding: 15,
                borderRadius: 10,
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {/* INFO */}
                <div>
                  <p style={{ fontWeight: "bold", fontSize: 16 }}>
                    {o.cliente?.nombre || "Sin cliente"}
                  </p>

                  <p style={{ color: "#6b7280" }}>
                    {o.producto} - {o.marca} {o.modelo || ""}
                  </p>

                  <p style={{ fontSize: 12, color: "#9ca3af" }}>
                    Código: {o.codigo}
                  </p>

                  <p
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontWeight: "bold",
                      color:
                        o.estado === "LISTO"
                          ? "#16a34a"
                          : o.estado === "REPARACION"
                          ? "#f59e0b"
                          : "#64748b",
                    }}
                  >
                    {o.estado}
                  </p>
                </div>

                {/* ICONOS */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {/* 💳 CRÉDITO */}
                  {o.deuda > 0 && (
                    <div
                      title="Cliente con deuda"
                      style={{
                        fontSize: 24,
                      }}
                    >
                      💳
                    </div>
                  )}

                  {/* 🛡️ GARANTÍA */}
                  {o.fechaGarantia &&
                  new Date(o.fechaGarantia) >= new Date() ? (
                    <div
                      title="En garantía"
                      style={{
                        fontSize: 24,
                      }}
                    >
                      🛡️
                    </div>
                  ) : (
                    <div
                      title="Sin garantía"
                      style={{
                        fontSize: 24,
                      }}
                    >
                      ❌
                    </div>
                  )}
                </div>
              </div>

              {/* BOTÓN */}
              <Link href={`/ordenes/${o.id}`}>
                <button
                  style={{
                    marginTop: 10,
                    background: "#2563eb",
                    color: "white",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  🔍 Ver detalle
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}