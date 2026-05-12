"use client";

import { useState } from "react";

export default function NuevaOrdenPage() {
  const [busqueda, setBusqueda] = useState("");
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");

  const [error, setError] = useState("");

  const inputStyle = {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  };

  async function buscar(valor: string) {
    setBusqueda(valor);

    if (valor.length < 2) return;

    const res = await fetch(`/api/clientes?q=${valor}`);
    const data = await res.json();
    setClientes(data);
  }

  function validar(form: any) {
    if (!clienteId) {
      setError("⚠️ Debes seleccionar un cliente");
      return false;
    }

    if (!form.get("marca")) {
      setError("⚠️ La marca es obligatoria");
      return false;
    }

    if (!form.get("problema")) {
      setError("⚠️ Describe el problema del equipo");
      return false;
    }

    setError("");
    return true;
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1 style={{ fontSize: 24 }}>🧾 Nueva Orden</h1>

      {/* ERROR */}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: 10,
            borderRadius: 6,
            marginTop: 10,
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const form = new FormData(e.currentTarget);

            if (!validar(form)) return;

            const res = await fetch("/api/orden", {
              method: "POST",
              body: form,
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
              console.error("ERROR:", data);
              setError(data.error || "Error al guardar orden");
              return;
            }

            // 📲 WhatsApp
            const msg = `Hola, tu equipo fue registrado en el taller ✅
Código: ${data.codigo}`;

            window.open(
              `https://wa.me/51${data.telefono}?text=${encodeURIComponent(msg)}`
            );

            // 🧾 TICKET 80MM (CON CORTE)
            const ticket = `
--------------------------------
        TALLER PRO
--------------------------------
Código: ${data.codigo}

Cliente: ${clienteNombre}

Equipo: ${form.get("marca")}
Modelo: ${form.get("modelo") || "-"}

Serie: ${form.get("serie") || "-"}

Problema:
${form.get("problema")}

Fecha: ${new Date().toLocaleString()}

--------------------------------
   EQUIPO EN RECEPCIÓN
--------------------------------





`;

            // 🖨 imprimir
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

            // ✅ REDIRECCIÓN
            window.location.href = "/ordenes?ok=1";

          } catch (err) {
            console.error(err);
            setError("Error de conexión");
          }
        }}
      >

        {/* BUSCAR CLIENTE */}
        <input
          value={busqueda}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Buscar cliente por DNI o nombre"
          style={inputStyle}
        />

        {/* RESULTADOS */}
        {clientes.length > 0 && (
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 6,
              marginTop: 5,
            }}
          >
            {clientes.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setClienteId(c.id);
                  setClienteNombre(c.nombre);
                  setBusqueda(c.nombre);
                  setClientes([]);
                }}
                style={{
                  padding: 10,
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {c.nombre} - {c.dni}
              </div>
            ))}
          </div>
        )}

        {/* CLIENTE SELECCIONADO */}
        {clienteNombre && (
          <div
            style={{
              marginTop: 10,
              padding: 10,
              background: "#ecfdf5",
              border: "1px solid #10b981",
              borderRadius: 6,
            }}
          >
            ✅ Cliente: <b>{clienteNombre}</b>
          </div>
        )}

        <input type="hidden" name="clienteId" value={clienteId} />

        <br />

        {/* CAMPOS */}
        <input name="producto" defaultValue="Laptop" style={inputStyle} />
        <input name="marca" placeholder="Marca" style={inputStyle} />
        <input name="modelo" placeholder="Modelo" style={inputStyle} />
        <input name="serie" placeholder="Serie" style={inputStyle} />

        <textarea
          name="problema"
          placeholder="Problema del equipo"
          style={{ ...inputStyle, height: 100 }}
        />

        {/* 📸 FOTOS */}
        <input
          type="file"
          name="fotos"
          multiple
          style={inputStyle}
        />

        {/* BOTÓN */}
        <button
          style={{
            marginTop: 15,
            width: "100%",
            background: "#2563eb",
            color: "white",
            padding: 12,
            borderRadius: 8,
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          💾 Guardar orden
        </button>
      </form>
    </div>
  );
}