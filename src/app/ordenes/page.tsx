import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrdenesPage({
  searchParams,
}: any) {

  const resolvedSearchParams = await searchParams;

  const q = resolvedSearchParams?.q || "";

  const ordenes = await prisma.orden.findMany({
    where: {
      OR: [
        {
          codigo: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          marca: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          modelo: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          serie: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          cliente: {
            nombre: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      ],
    },

    include: {
      cliente: true,
    },

    orderBy: {
      id: "desc",
    },
  });

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            fontSize: 32,
            color: "white",
            margin: 0,
          }}
        >
          📋 Órdenes
        </h1>

        <Link href="/ordenes/nueva">
          <button
            style={{
              background: "#2563eb",
              color: "white",
              padding: "14px 18px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            ➕ Nueva Orden
          </button>
        </Link>
      </div>

      {/* BUSCADOR */}
      <form
        style={{
          marginTop: 20,
        }}
      >
        <input
          name="q"
          placeholder="🔍 Buscar cliente, serie, marca..."
          defaultValue={resolvedSearchParams?.q || ""}
          style={{
            width: "100%",
            padding: 18,
            borderRadius: 12,
            border: "2px solid black",
            fontSize: 18,
            background: "white",
            color: "black",
            boxSizing: "border-box",
          }}
        />
      </form>

      {/* ÉXITO */}
      {resolvedSearchParams?.ok && (
        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: 15,
            borderRadius: 10,
            marginTop: 15,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          ✅ Orden creada correctamente
        </div>
      )}

      {/* VACÍO */}
      {ordenes.length === 0 ? (
        <div
          style={{
            marginTop: 25,
            padding: 30,
            borderRadius: 16,
            background: "#111827",
            border: "1px solid #374151",
            textAlign: "center",
            color: "white",
            fontSize: 20,
          }}
        >
          No hay órdenes registradas
        </div>
      ) : (
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gap: 15,
          }}
        >
          {ordenes.map((o) => (
            <div
              key={o.id}
              style={{
                background: "#111827",
                padding: 18,
                borderRadius: 16,
                border: "1px solid #374151",
              }}
            >
              {/* TOP */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 15,
                  flexWrap: "wrap",
                }}
              >
                {/* INFO */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 240,
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: 22,
                      color: "white",
                    }}
                  >
                    {o.cliente?.nombre || "Sin cliente"}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      color: "#d1d5db",
                      fontSize: 18,
                    }}
                  >
                    {o.producto} - {o.marca} {o.modelo || ""}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      color: "#9ca3af",
                      fontSize: 14,
                    }}
                  >
                    Código: {o.codigo}
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      display: "inline-block",
                      padding: "6px 12px",
                      borderRadius: 999,
                      fontWeight: "bold",
                      fontSize: 14,
                      background:
                        o.estado === "LISTO"
                          ? "#166534"
                          : o.estado === "REPARACION"
                          ? "#92400e"
                          : "#334155",
                      color: "white",
                    }}
                  >
                    {o.estado}
                  </div>
                </div>

                {/* ICONOS */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    fontSize: 30,
                  }}
                >
                  {(o.deuda || 0) > 0 && (
                    <div title="Cliente con deuda">
                      💳
                    </div>
                  )}

                  {o.fechaGarantia &&
                  new Date(o.fechaGarantia) >= new Date() ? (
                    <div title="En garantía">
                      🛡️
                    </div>
                  ) : (
                    <div title="Sin garantía">
                      ❌
                    </div>
                  )}

                  {o.fotos?.length > 0 && (
                    <div title="Tiene fotos">
                      📸
                    </div>
                  )}
                </div>
              </div>

              {/* MINI FOTOS */}
              {o.fotos?.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    overflowX: "auto",
                    marginTop: 15,
                    paddingBottom: 5,
                  }}
                >
                  {o.fotos.map((foto, index) => (
                    <img
                      key={index}
                      src={foto}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "2px solid #374151",
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* BOTÓN */}
              <Link href={`/ordenes/${o.id}`}>
                <button
                  style={{
                    marginTop: 18,
                    background: "#2563eb",
                    color: "white",
                    padding: "14px 16px",
                    border: "none",
                    borderRadius: 12,
                    cursor: "pointer",
                    width: "100%",
                    fontSize: 17,
                    fontWeight: "bold",
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