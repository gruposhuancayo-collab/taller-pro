"use client";

import { useState } from "react";

export default function DetalleClient({ orden }: any) {
  const [loading, setLoading] = useState(false);
  const [dataFinal, setDataFinal] = useState<any>(orden);

  async function finalizar() {
    const reparacion = prompt("🔧 ¿Qué reparación se realizó?");
    if (!reparacion) return;

    const precioInput = prompt("💰 ¿Cuánto costó?");
    if (!precioInput) return;

    const precio = Number(precioInput);

    const tipoPago = confirm("¿Pago al CONTADO?\nAceptar = CONTADO\nCancelar = CRÉDITO")
      ? "CONTADO"
      : "CREDITO";

    try {
      setLoading(true);

      const form = new FormData();
      form.append("id", orden.id);
      form.append("reparacion", reparacion);
      form.append("precio", String(precio));
      form.append("tipoPago", tipoPago);

      const res = await fetch("/api/orden/listo", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert("Error al finalizar");
        return;
      }

      // ✅ ACTUALIZA UI
      setDataFinal({
        ...orden,
        estado: "LISTO",
        reparacion: data.reparacion,
        precio: data.precio,
        tipoPago: data.tipoPago,
        recibo: data.recibo,
        deuda: data.deuda,
      });

      // 📲 WHATSAPP
      window.open(
        `https://wa.me/51${data.telefono}?text=${encodeURIComponent(data.msg)}`
      );

      // 🧾 TICKET AUTOMÁTICO
      const ticket = `
--------------------------------
        TALLER PRO
--------------------------------
Cliente: ${orden.cliente.nombre}

Equipo: ${orden.marca} ${orden.modelo || ""}

🔧 Reparación:
${data.reparacion}

💰 Total: S/ ${data.precio}
💳 Pago: ${data.tipoPago}

🧾 Recibo: ${data.recibo}

Fecha: ${new Date().toLocaleString()}

--------------------------------
   EQUIPO ENTREGADO
--------------------------------






`;

      const win = window.open("", "", "width=300,height=600");

      win?.document.write(`
<pre style="font-size:12px">
${ticket}
</pre>
<script>
window.print();
window.close();
</script>
      `);

    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h1>🧾 Orden #{dataFinal.codigo}</h1>

      <div style={{ background: "#fff", padding: 15, borderRadius: 10 }}>
        <p><b>Cliente:</b> {dataFinal.cliente.nombre}</p>
        <p><b>Celular:</b> {dataFinal.cliente.celular}</p>
        <p><b>Equipo:</b> {dataFinal.marca} {dataFinal.modelo}</p>
        <p><b>Estado:</b> {dataFinal.estado}</p>
      </div>

      <hr />

      {/* 🔧 RESULTADO */}
      {dataFinal.estado === "LISTO" && (
        <div style={{ background: "#ecfdf5", padding: 15, borderRadius: 10 }}>
          <h3>✅ Reparación finalizada</h3>
          <p><b>Reparación:</b> {dataFinal.reparacion}</p>
          <p><b>Total:</b> S/ {dataFinal.precio}</p>
          <p><b>Pago:</b> {dataFinal.tipoPago}</p>
          <p><b>Recibo:</b> {dataFinal.recibo}</p>
          <p><b>Deuda:</b> S/ {dataFinal.deuda || 0}</p>

          {/* 🖨 BOTÓN REIMPRIMIR */}
          <button
            onClick={() => {
              const ticket = `
--------------------------------
        TALLER PRO
--------------------------------
Cliente: ${dataFinal.cliente.nombre}

Equipo: ${dataFinal.marca} ${dataFinal.modelo || ""}

🔧 Reparación:
${dataFinal.reparacion}

💰 Total: S/ ${dataFinal.precio}
💳 Pago: ${dataFinal.tipoPago}

🧾 Recibo: ${dataFinal.recibo}

--------------------------------






`;

              const win = window.open("", "", "width=300,height=600");

              win?.document.write(`
<pre style="font-size:12px">
${ticket}
</pre>
<script>
setTimeout(() => {
  window.print();
  window.close();
}, 500);
</script>
              `);
            }}
            style={{
              marginTop: 10,
              background: "#111827",
              color: "white",
              padding: 10,
              width: "100%",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
          >
            🖨 Reimprimir ticket
          </button>

          {/* 💸 BOTÓN REGISTRAR PAGO */}
          {dataFinal.deuda > 0 && (
            <button
              onClick={async () => {
                const montoInput = prompt(`💰 Deuda actual: S/ ${dataFinal.deuda}\n¿Cuánto pagó?`);
                if (!montoInput) return;

                const monto = Number(montoInput);

                const metodo = confirm("¿Pago con EFECTIVO?\nAceptar = EFECTIVO\nCancelar = YAPE")
                  ? "EFECTIVO"
                  : "YAPE";

                const form = new FormData();
                form.append("ordenId", dataFinal.id);
                form.append("monto", String(monto));
                form.append("metodo", metodo);

                const res = await fetch("/api/pago", {
                  method: "POST",
                  body: form,
                });

                const data = await res.json();

                if (!res.ok || !data.ok) {
                  alert("Error al registrar pago");
                  return;
                }

                // actualizar UI
                setDataFinal({
                  ...dataFinal,
                  deuda: data.deuda,
                });

                // 📲 WhatsApp
                window.open(
                  `https://wa.me/51${data.telefono}?text=${encodeURIComponent(data.msg)}`
                );

                // 🧾 ticket pago
                const ticket = `
--------------------------------
        TALLER PRO
--------------------------------
Cliente: ${dataFinal.cliente.nombre}

💰 Pago recibido: S/ ${monto}
💳 Método: ${metodo}

📉 Deuda restante: S/ ${data.deuda}

Fecha: ${new Date().toLocaleString()}

--------------------------------






`;

                const win = window.open("", "", "width=300,height=600");

                win?.document.write(`
<pre style="font-size:12px">
${ticket}
</pre>
<script>
window.print();
window.close();
</script>
                `);
              }}
              style={{
                marginTop: 10,
                background: "#2563eb",
                color: "white",
                padding: 12,
                width: "100%",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              💸 Registrar pago
            </button>
          )}
        </div>
      )}

      <hr />

      {/* BOTÓN FINALIZAR */}
      {dataFinal.estado !== "LISTO" && (
        <button
          onClick={finalizar}
          disabled={loading}
          style={{
            background: "#16a34a",
            color: "white",
            padding: 15,
            width: "100%",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {loading ? "Procesando..." : "✅ Marcar como LISTO"}
        </button>
      )}
    </div>
  );
}