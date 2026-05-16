import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SeguimientoPage({
  params,
}: any) {

  const codigo = params.codigo;

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
        maxWidth: 700,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >

        <h1
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          🛠️ SHINHWA REPAIR
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: 20,
          }}
        >
          Seguimiento de orden de servicio
        </p>

        <div
          style={{
            background: "#f3f4f6",
            padding: 15,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <p>
            <strong>Orden:</strong> {orden.codigo}
          </p>

          <p>
            <strong>Cliente:</strong> {orden.cliente.nombre}
          </p>

          <p>
            <strong>Equipo:</strong> {orden.producto}
          </p>

          <p>
            <strong>Marca:</strong> {orden.marca}
          </p>

          <p>
            <strong>Modelo:</strong> {orden.modelo || "-"}
          </p>

          <p>
            <strong>Serie:</strong> {orden.serie || "-"}
          </p>

          <p>
            <strong>Estado:</strong>{" "}
            <span
              style={{
                color:
                  orden.estado === "LISTO"
                    ? "green"
                    : "#f59e0b",
                fontWeight: "bold",
              }}
            >
              {orden.estado}
            </span>
          </p>
        </div>

        <div
          style={{
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              marginBottom: 10,
            }}
          >
            🛠️ Problema reportado
          </h2>

          <div
            style={{
              background: "#fafafa",
              padding: 15,
              borderRadius: 12,
            }}
          >
            {orden.problema}
          </div>
        </div>

        {/* 📸 FOTOS */}
        {orden.fotos?.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: 22,
                marginBottom: 15,
              }}
            >
              📸 Fotos del equipo
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(150px,1fr))",
                gap: 15,
              }}
            >
              {orden.fotos.map((foto, i) => (
                <a
                  key={i}
                  href={foto}
                  target="_blank"
                >
                  <img
                    src={foto}
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "1px solid #ddd",
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* GARANTÍA */}
        <div
          style={{
            marginTop: 30,
            background: "#ecfeff",
            padding: 15,
            borderRadius: 12,
          }}
        >
          <h3
            style={{
              marginBottom: 10,
            }}
          >
            📋 Garantía
          </h3>

          <p>
            La reparación cuenta con garantía
            limitada de 6 meses únicamente
            sobre el servicio técnico realizado.
          </p>

          <br />

          <p>
            La garantía se invalida si el equipo
            es manipulado por terceros,
            presenta golpes, humedad,
            sulfatación o daños ajenos a la
            reparación original.
          </p>
        </div>

      </div>
    </div>
  );
}