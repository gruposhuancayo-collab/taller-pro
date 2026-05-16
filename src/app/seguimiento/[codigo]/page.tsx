import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SeguimientoPage({
  params,
}: any) {

  const resolvedParams = await params;

  const codigo = resolvedParams.codigo;

  const orden = await prisma.orden.findFirst({
    where: {
      codigo,
    },

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
        minHeight: "100vh",
        background: "#0f172a",
        padding: 14,
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        {/* CARD PRINCIPAL */}
        <div
          style={{
            background: "#111827",
            borderRadius: 20,
            padding: 18,
            border: "1px solid #374151",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        >
          {/* LOGO */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 32,
                marginBottom: 8,
              }}
            >
              🛠️
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: "bold",
                lineHeight: 1.2,
              }}
            >
              SHINHWA REPAIR
            </h1>

            <p
              style={{
                color: "#9ca3af",
                marginTop: 8,
                fontSize: 15,
                lineHeight: 1.5,
              }}
            >
              Seguimiento de Servicio Técnico
            </p>
          </div>

          {/* ESTADO */}
          <div
            style={{
              background:
                orden.estado === "LISTO"
                  ? "#166534"
                  : orden.estado === "REPARACION"
                  ? "#92400e"
                  : "#1e293b",

              padding: 16,
              borderRadius: 14,
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 18,
              marginBottom: 20,
            }}
          >
            📋 Estado actual: {orden.estado}
          </div>

          {/* DATOS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                background: "#1f2937",
                padding: 14,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: 13,
                  marginBottom: 5,
                }}
              >
                NÚMERO DE ORDEN
              </div>

              <div
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  wordBreak: "break-word",
                }}
              >
                {orden.codigo}
              </div>
            </div>

            <div
              style={{
                background: "#1f2937",
                padding: 14,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: 13,
                  marginBottom: 5,
                }}
              >
                CLIENTE
              </div>

              <div
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  wordBreak: "break-word",
                }}
              >
                {orden.cliente?.nombre}
              </div>
            </div>

            <div
              style={{
                background: "#1f2937",
                padding: 14,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: 13,
                  marginBottom: 5,
                }}
              >
                EQUIPO
              </div>

              <div
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  wordBreak: "break-word",
                }}
              >
                {orden.producto}
              </div>
            </div>

            <div
              style={{
                background: "#1f2937",
                padding: 14,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: 13,
                  marginBottom: 5,
                }}
              >
                MARCA Y MODELO
              </div>

              <div
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  wordBreak: "break-word",
                }}
              >
                {orden.marca} {orden.modelo || ""}
              </div>
            </div>
          </div>
        </div>

        {/* FOTOS */}
        {orden.fotos?.length > 0 && (
          <div
            style={{
              marginTop: 18,
              background: "#111827",
              borderRadius: 20,
              padding: 18,
              border: "1px solid #374151",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 18,
                fontSize: 22,
              }}
            >
              📸 Fotos del equipo
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(140px,1fr))",
                gap: 14,
              }}
            >
              {orden.fotos.map(
                (foto: string, i: number) => (
                  <a
                    key={i}
                    href={foto}
                    target="_blank"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <img
                      src={foto}
                      style={{
                        width: "100%",
                        height: 160,
                        objectFit: "cover",
                        borderRadius: 14,
                        border: "2px solid #374151",
                      }}
                    />
                  </a>
                )
              )}
            </div>
          </div>
        )}

        {/* GARANTÍA */}
        <div
          style={{
            marginTop: 18,
            background: "#111827",
            borderRadius: 20,
            padding: 18,
            border: "1px solid #374151",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: 14,
              fontSize: 22,
            }}
          >
            📋 Garantía del servicio
          </h2>

          <div
            style={{
              color: "#e5e7eb",
              fontSize: 15,
              lineHeight: 1.8,
            }}
          >
            <p>
              ✅ La reparación realizada cuenta con
              garantía limitada de 6 meses sobre el
              servicio técnico efectuado.
            </p>

            <p>
              ❌ La garantía quedará anulada si el
              equipo presenta:
            </p>

            <ul
              style={{
                paddingLeft: 20,
              }}
            >
              <li>Golpes</li>
              <li>Humedad</li>
              <li>Sulfatación</li>
              <li>Manipulación por terceros</li>
            </ul>

            <p>
              ⚠️ La garantía NO cubre:
            </p>

            <ul
              style={{
                paddingLeft: 20,
              }}
            >
              <li>Pantalla</li>
              <li>Batería</li>
              <li>Cargador</li>
              <li>Bisagras</li>
              <li>Golpes</li>
              <li>Daños eléctricos</li>
            </ul>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 13,
            marginTop: 20,
            paddingBottom: 30,
            lineHeight: 1.6,
          }}
        >
          SHINHWA REPAIR © {new Date().getFullYear()}
          <br />
          Servicio técnico especializado
        </div>
      </div>
    </div>
  );
}