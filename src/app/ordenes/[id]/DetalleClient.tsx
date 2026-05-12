"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DetalleClient({ orden }: any) {
  const [loading, setLoading] = useState(false);
  const [dataFinal, setDataFinal] = useState<any>(orden);

  const router = useRouter();

  // 🔥 GARANTÍA REAL
  const garantiaVigente = (() => {
    if (!dataFinal?.fechaGarantia) return false;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const garantia = new Date(dataFinal.fechaGarantia);
    garantia.setHours(23, 59, 59, 999);

    return garantia >= hoy;
  })();

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h1>🧾 Orden #{dataFinal.codigo}</h1>

      {/* 📦 INFO */}
      <div style={{ background: "#fff", padding: 15, borderRadius: 10 }}>
        <p><b>Cliente:</b> {dataFinal.cliente.nombre}</p>

        <p><b>Celular:</b> {dataFinal.cliente.celular}</p>

        <p>
          <b>Equipo:</b> {dataFinal.marca} {dataFinal.modelo}
        </p>

        <p><b>Problema:</b> {dataFinal.problema}</p>

        <p>
          <b>Estado:</b>{" "}
          {dataFinal.estado === "LISTO" ? (
            <span style={{ color: "green", fontWeight: "bold" }}>
              ✅ LISTO
            </span>
          ) : dataFinal.estado === "GARANTIA" ? (
            <span style={{ color: "#2563eb", fontWeight: "bold" }}>
              🔄 GARANTÍA
            </span>
          ) : (
            dataFinal.estado
          )}
        </p>

        {/* 🔥 GARANTÍA */}
        <p>
          <b>Garantía:</b>{" "}
          {garantiaVigente ? (
            <span style={{ color: "green", fontWeight: "bold" }}>
              🟢 En garantía
            </span>
          ) : (
            <span style={{ color: "red", fontWeight: "bold" }}>
              🔴 Sin garantía
            </span>
          )}
        </p>

        <p>
          <b>Ingreso:</b>{" "}
          {new Date(dataFinal.fechaIngreso).toLocaleDateString()}
        </p>

        {dataFinal.fechaGarantia && (
          <p>
            <b>Garantía hasta:</b>{" "}
            {new Date(dataFinal.fechaGarantia).toLocaleDateString()}
          </p>
        )}

        {/* 📸 FOTO */}
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];

            if (!file) return;

            const form = new FormData();
            form.append("file", file);

            const upload = await fetch("/api/upload", {
              method: "POST",
              body: form,
            });

            const upData = await upload.json();

            if (!upData.ok) {
              alert("Error subiendo imagen");
              return;
            }

            const save = new FormData();

            save.append("id", String(dataFinal.id));
            save.append("url", upData.url);

            await fetch("/api/orden/foto", {
              method: "POST",
              body: save,
            });

            setDataFinal((prev: any) => ({
              ...prev,
              fotos: [...(prev.fotos || []), upData.url],
            }));
          }}
          style={{ marginTop: 10 }}
        />

        {/* 👀 FOTOS */}
        <div style={{ marginTop: 15 }}>
          <h4>📸 Fotos del equipo</h4>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {dataFinal.fotos?.map((f: string, i: number) => (
              <img
                key={i}
                src={f}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
                onClick={() => window.open(f)}
              />
            ))}
          </div>
        </div>
      </div>

      <hr />

      {/* ✅ REPARACIÓN NORMAL */}
      {dataFinal.estado !== "LISTO" && !garantiaVigente && (
        <button
          onClick={async () => {
            const problema = prompt("🔧 Reparación realizada");

            if (!problema) return;

            const precioInput = prompt("💰 Costo reparación");

            if (!precioInput) return;

            const precio = Number(precioInput);

            const tipoPago = confirm(
              "¿Pago al CONTADO?\nAceptar = CONTADO\nCancelar = CRÉDITO"
            )
              ? "CONTADO"
              : "CREDITO";

            try {
              setLoading(true);

              const res = await fetch("/api/orden/estado", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: dataFinal.id,
                  estado: "LISTO",
                  problema,
                  precio,
                  tipoPago,
                }),
              });

              const data = await res.json();

              setDataFinal(data.orden);

              router.refresh();

              if (data.whatsapp) {
                window.open(
                  `https://wa.me/51${data.telefono}?text=${encodeURIComponent(
                    data.whatsapp
                  )}`
                );
              }
            } catch {
              alert("Error");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          style={btn("#16a34a")}
        >
          {loading ? "Procesando..." : "✅ Marcar listo"}
        </button>
      )}

      {/* 🔄 REPARAR GARANTÍA */}
      {garantiaVigente && dataFinal.estado !== "LISTO" && (
        <button
          onClick={async () => {
            const problema = prompt(
              "🔧 Reparación realizada por garantía"
            );

            if (!problema) return;

            const res = await fetch("/api/orden/estado", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: dataFinal.id,
                estado: "GARANTIA_REPARADA",
                problema,
              }),
            });

            const data = await res.json();

            setDataFinal(data.orden);

            router.refresh();

            if (data.whatsapp) {
              window.open(
                `https://wa.me/51${data.telefono}?text=${encodeURIComponent(
                  data.whatsapp
                )}`
              );
            }
          }}
          style={btn("#2563eb")}
        >
          🔄 Reparar por garantía
        </button>
      )}

      {/* ❌ NO REPARADO */}
      {dataFinal.estado !== "LISTO" && (
        <button
          onClick={async () => {
            const motivo = prompt("❌ Motivo");

            if (!motivo) return;

            const res = await fetch("/api/orden/estado", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: dataFinal.id,
                estado: "NO_REPARADO",
                motivo,
              }),
            });

            const data = await res.json();

            setDataFinal((prev: any) => ({
              ...prev,
              estado: "NO_REPARADO",
            }));

            router.refresh();

            if (data.whatsapp) {
              window.open(
                `https://wa.me/51${data.telefono}?text=${encodeURIComponent(
                  data.whatsapp
                )}`
              );
            }
          }}
          style={btn("#dc2626")}
        >
          ❌ No se pudo reparar
        </button>
      )}

      {/* 💸 PAGAR DEUDA */}
      {dataFinal.deuda > 0 && (
        <button
          onClick={async () => {
            const ok = confirm(
              `¿Marcar deuda pagada de ${dataFinal.cliente?.nombre}?`
            );

            if (!ok) return;

            try {
              const res = await fetch("/api/pagar-deuda", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: dataFinal.id,
                }),
              });

              const data = await res.json();

              if (!data.ok) {
                alert(data.error || "Error");
                return;
              }

              if (data.whatsapp) {
                window.open(
                  `https://wa.me/51${data.telefono}?text=${encodeURIComponent(
                    data.whatsapp
                  )}`
                );
              }

              alert("✅ Deuda pagada");

              setDataFinal((prev: any) => ({
                ...prev,
                deuda: 0,
                tipoPago: "CONTADO",
                fechaPago: new Date(),
              }));

              router.refresh();

              location.reload();

            } catch (error) {
              console.log(error);
              alert("Error servidor");
            }
          }}
          style={btn("#16a34a")}
        >
          💸 PAGAR DEUDA
        </button>
      )}

      {/* 🧾 IMPRIMIR */}
      <button
        onClick={() => window.print()}
        style={btn("#111827")}
      >
        🖨️ Volver a imprimir
      </button>

      <hr />

      {/* ✅ RESULTADO */}
      {dataFinal.estado === "LISTO" && (
        <div style={{ background: "#ecfdf5", padding: 15, borderRadius: 10 }}>
          <h3>✅ Reparación finalizada</h3>

          <p><b>Reparación:</b> {dataFinal.problema}</p>

          <p>
            <b>Total:</b>{" "}
            {dataFinal.enGarantia
              ? "GARANTÍA"
              : `S/ ${dataFinal.precio || 0}`}
          </p>

          <p><b>Pago:</b> {dataFinal.tipoPago}</p>

          {dataFinal.fechaPago && (
            <p>
              <b>Pagado:</b>{" "}
              {new Date(dataFinal.fechaPago).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function btn(color: string) {
  return {
    marginTop: 10,
    padding: 14,
    background: color,
    color: "white",
    border: "none",
    borderRadius: 8,
    width: "100%",
    cursor: "pointer",
  } as const;
}