import { prisma } from "@/lib/prisma";
import CajaBotones from "@/components/CajaBotones";
import BotonPagar from "@/components/BotonPagar";

export default async function Caja(props: {
  searchParams?: Promise<{ desde?: string; hasta?: string }>;
}) {
  const searchParams = await props.searchParams;

  const desde = searchParams?.desde
    ? new Date(searchParams.desde)
    : new Date(new Date().setHours(0, 0, 0, 0));

  const hasta = searchParams?.hasta
    ? new Date(searchParams.hasta)
    : new Date();

  // ✅ ÓRDENES
  const ordenes = await prisma.orden.findMany({
    where: {
      estado: "LISTO",
      updatedAt: { gte: desde, lte: hasta },
    },
    include: { cliente: true },
  });

  // 🔴 CLIENTES CON DEUDA
  const deudores = await prisma.orden.findMany({
    where: {
      tipoPago: "CREDITO",
      estado: "LISTO",
      deuda: { gt: 0 },
    },
    include: { cliente: true },
  });

  // 💸 PAGOS
  const pagos = await prisma.pago.findMany({
    where: {
      createdAt: { gte: desde, lte: hasta },
    },
    include: {
      orden: {
        include: { cliente: true },
      },
    },
  });

  // ➕ EXTRAS
  const extras = await prisma.ingresoExtra.findMany({
    where: {
      createdAt: { gte: desde, lte: hasta },
    },
  });

  // 💰 TOTALES
  const totalOrdenes = ordenes
    .filter(
      (o) =>
        o.tipoPago === "CONTADO" &&
        !o.enGarantia
    )
    .reduce((a, o) => a + (o.precio || 0), 0);

  const totalPagos = pagos.reduce((a, p) => a + p.monto, 0);

  const totalExtras = extras.reduce((a, e) => a + e.monto, 0);

  const total = totalOrdenes + totalPagos + totalExtras;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "auto" }}>
      <h1 style={{ fontSize: 28 }}>💰 Caja</h1>

      {/* 🔍 FILTRO */}
      <form
        style={{
          marginTop: 15,
          display: "grid",
          gap: 10,
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          alignItems: "end",
        }}
      >
        <div>
          <label>Desde:</label>

          <input
            type="date"
            name="desde"
            defaultValue={searchParams?.desde}
            style={{
              padding: 10,
              fontSize: 16,
              width: "100%",
            }}
          />
        </div>

        <div>
          <label>Hasta:</label>

          <input
            type="date"
            name="hasta"
            defaultValue={searchParams?.hasta}
            style={{
              padding: 10,
              fontSize: 16,
              width: "100%",
            }}
          />
        </div>

        <button
          style={{
            padding: 14,
            fontSize: 16,
            borderRadius: 8,
            width: "100%",
            background: "#2563eb",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          🔍 Filtrar
        </button>
      </form>

      {/* 🔥 BOTONES */}
      <CajaBotones />

      {/* 💰 TARJETAS */}
      <div
        style={{
          marginTop: 20,
          display: "grid",
          gap: 15,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        <div style={cardStyle}>
          <p style={labelStyle}>Órdenes</p>

          <h2 style={{ color: "#16a34a" }}>
            S/ {totalOrdenes}
          </h2>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Pagos deuda</p>

          <h2 style={{ color: "#f59e0b" }}>
            S/ {totalPagos}
          </h2>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Extras</p>

          <h2 style={{ color: "#3b82f6" }}>
            S/ {totalExtras}
          </h2>
        </div>

        <div
          style={{
            ...cardStyle,
            background: "#111827",
            color: "white",
          }}
        >
          <p style={labelStyle}>TOTAL</p>

          <h2 style={{ fontSize: 28 }}>
            S/ {total}
          </h2>
        </div>
      </div>

      {/* 🔔 DEUDORES */}
      <div style={{ marginTop: 30 }}>
        <h2>🔔 Clientes con deuda</h2>

        {deudores.length === 0 ? (
          <p>No hay deudas</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {deudores.map((o) => (
              <div
                key={o.id}
                style={{
                  ...rowStyle,
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <div>
                  <div>
                    ⚠️ {o.cliente?.nombre}
                  </div>

                  <div
                    style={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    S/ {o.deuda || o.precio}
                  </div>
                </div>

                <BotonPagar
                  id={o.id}
                  nombre={o.cliente?.nombre || ""}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📋 HISTORIAL */}
      <div style={{ marginTop: 30 }}>
        <h2>📋 Movimientos</h2>

        {pagos.length === 0 &&
        ordenes.length === 0 &&
        extras.length === 0 ? (
          <p>No hay movimientos</p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 10,
            }}
          >
            {/* 🧾 ÓRDENES */}
            {ordenes.map((o) => (
              <div
                key={`o-${o.id}`}
                style={rowStyle}
              >
                <div>
                  <div>
                    🧾 {o.cliente?.nombre}
                  </div>

                  <small style={{ color: "#6b7280" }}>
                    {new Date(o.updatedAt).toLocaleString()}
                  </small>
                </div>

                <span
                  style={{
                    color: o.enGarantia
                      ? "#3b82f6"
                      : "#16a34a",
                    fontWeight: 600,
                  }}
                >
                  {o.enGarantia
                    ? "GARANTÍA"
                    : `S/ ${o.precio || 0}`}
                </span>
              </div>
            ))}

            {/* 💸 PAGOS */}
            {pagos.map((p) => (
              <div
                key={`p-${p.id}`}
                style={rowStyle}
              >
                <div>
                  <div>
                    💸 {p.orden?.cliente?.nombre}
                  </div>

                  <small style={{ color: "#6b7280" }}>
                    {new Date(p.createdAt).toLocaleString()}
                  </small>
                </div>

                <span
                  style={{ color: "#f59e0b" }}
                >
                  + S/ {p.monto}
                </span>
              </div>
            ))}

            {/* ➕ EXTRAS */}
            {extras.map((e) => (
              <div
                key={`e-${e.id}`}
                style={rowStyle}
              >
                <div>
                  <div>➕ {e.detalle}</div>

                  <small style={{ color: "#6b7280" }}>
                    {new Date(e.createdAt).toLocaleString()}
                  </small>
                </div>

                <span
                  style={{ color: "#3b82f6" }}
                >
                  + S/ {e.monto}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 🎨 ESTILOS
const cardStyle = {
  padding: 15,
  borderRadius: 12,
  background: "white",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  border: "1px solid #e5e7eb",
  width: "100%",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  fontSize: 14,
  color: "#6b7280",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: 12,
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  background: "white",
};