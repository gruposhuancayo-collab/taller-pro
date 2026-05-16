import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrdenesPage({
  searchParams,
}: any) {

  const resolvedSearchParams =
    await searchParams;

  const q =
    resolvedSearchParams?.q || "";

  const ordenes =
    await prisma.orden.findMany({
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
        padding: 12,
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: 10,
          marginBottom: 15,
        }}
      >
        <h1
          style={{
            fontSize: 28,
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
              padding: "12px 14px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            ➕ Nueva
          </button>
        </Link>
      </div>

      {/* BUSCADOR */}
      <form>
        <input
          name="q"
          placeholder="🔍 Buscar cliente o código"
          defaultValue={
            resolvedSearchParams?.q || ""
          }
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 10,
            border: "2px solid black",
            fontSize: 16,
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
            padding: 12,
            borderRadius: 10,
            marginTop: 15,
            fontWeight: "bold",
            fontSize: 15,
          }}
        >
          ✅ Orden creada correctamente
        </div>
      )}

      {/* VACÍO */}
      {ordenes.length === 0 ? (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            borderRadius: 12,
            background: "#111827",
            textAlign: "center",
            color: "white",
          }}
        >
          No hay órdenes registradas
        </div>
      ) : (
        <div
          style={{
            marginTop: 15,
            display: "grid",
            gap: 10,
          }}
        >
          {ordenes.map((o) => {

            // ✅ MENSAJE WHATSAPP
            const mensaje = `
🛠️ SHINHWA REPAIR

📄 Orden:
${o.codigo}

👤 Cliente:
${o.cliente?.nombre || "-"}

💻 Equipo:
${o.producto || "-"}

🏷️ Marca:
${o.marca || "-"}

🧩 Modelo:
${o.modelo || "-"}

🔢 Serie:
${o.serie || "-"}

📋 Estado:
${o.estado || "-"}

📷 Seguimiento:
${process.env.NEXT_PUBLIC_APP_URL}/seguimiento/${o.codigo}

Gracias por confiar en SHINHWA REPAIR 🔧
`;

            const telefono =
              o.cliente?.celular || "";

            const wa =
              `https://wa.me/51${telefono}?text=${encodeURIComponent(mensaje)}`;

            return (
              <div
                key={o.id}
                style={{
                  background: "#111827",
                  padding: 14,
                  borderRadius: 12,
                  border:
                    "1px solid #374151",
                }}
              >
                {/* FILA */}
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  {/* INFO */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 17,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow:
                          "ellipsis",
                      }}
                    >
                      {o.cliente?.nombre}
                    </div>

                    <div
                      style={{
                        color: "#d1d5db",
                        fontSize: 14,
                        marginTop: 3,
                      }}
                    >
                      {o.marca}{" "}
                      {o.modelo || ""}
                    </div>

                    <div
                      style={{
                        color: "#9ca3af",
                        fontSize: 12,
                        marginTop: 3,
                      }}
                    >
                      {o.codigo}
                    </div>
                  </div>

                  {/* ESTADO */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection:
                        "column",
                      alignItems:
                        "flex-end",
                      gap: 5,
                    }}
                  >
                    <div
                      style={{
                        padding:
                          "5px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight:
                          "bold",
                        background:
                          o.estado ===
                          "LISTO"
                            ? "#166534"
                            : o.estado ===
                              "REPARACION"
                            ? "#92400e"
                            : "#334155",
                        color: "white",
                      }}
                    >
                      {o.estado}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 5,
                        fontSize: 18,
                      }}
                    >
                      {(o.deuda || 0) >
                        0 && <span>💳</span>}

                      {o.fotos?.length >
                        0 && <span>📸</span>}
                    </div>
                  </div>
                </div>

                {/* BOTONES */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  {/* DETALLE */}
                  <Link
                    href={`/ordenes/${o.id}`}
                    style={{
                      flex: 1,
                    }}
                  >
                    <button
                      style={{
                        background:
                          "#2563eb",
                        color: "white",
                        padding: "10px",
                        border: "none",
                        borderRadius: 10,
                        cursor: "pointer",
                        width: "100%",
                        fontSize: 14,
                        fontWeight:
                          "bold",
                      }}
                    >
                      🔍 Ver detalle
                    </button>
                  </Link>

                  {/* WHATSAPP */}
                  {telefono && (
                    <a
                      href={wa}
                      target="_blank"
                    >
                      <button
                        style={{
                          background:
                            "#16a34a",
                          color: "white",
                          padding:
                            "10px 14px",
                          border: "none",
                          borderRadius: 10,
                          cursor: "pointer",
                          fontSize: 20,
                          fontWeight:
                            "bold",
                        }}
                      >
                        🟢
                      </button>
                    </a>
                  )}

                  {/* IMPRIMIR */}
                  <button
                    onClick={() => {

                      const ticket = `
================================

      SHINHWA REPAIR

================================

ORDEN DE SERVICIO

Código:
${o.codigo}

Cliente:
${o.cliente?.nombre || "-"}

Equipo:
${o.producto || "-"}

Marca:
${o.marca || "-"}

Modelo:
${o.modelo || "-"}

Serie:
${o.serie || "-"}

--------------------------------

Estado:
${o.estado || "-"}

Fecha:
${new Date(
  o.createdAt
).toLocaleString()}

================================

Gracias por preferir
SHINHWA REPAIR

================================
`;

                      const printWindow =
                        window.open(
                          "",
                          "",
                          "width=400,height=800"
                        );

                      printWindow?.document.write(`
<html>
<head>
<title>Ticket</title>

<style>
body{
  font-family: monospace;
  width: 80mm;
  padding: 10px;
  font-size: 14px;
}

pre{
  white-space: pre-wrap;
}
</style>

</head>

<body>

<pre>${ticket}</pre>

<script>
window.print();
window.close();
</script>

</body>
</html>
`);
                    }}
                    style={{
                      background:
                        "#f59e0b",
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                      width: 50,
                      cursor: "pointer",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    🖨️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}