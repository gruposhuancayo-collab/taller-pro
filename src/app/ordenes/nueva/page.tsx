"use client";

import { useState, useEffect } from "react";

export default function NuevaOrdenPage() {
  const [busqueda, setBusqueda] = useState("");

  const [clientes, setClientes] = useState<any[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");

  // 🔥 NUEVO (FOTOS PRO)
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  const [error, setError] = useState("");

  const inputStyle = {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 16,
  };

  // 🔥 CARGAR CLIENTES
  useEffect(() => {
    cargarClientes();
  }, []);

  async function cargarClientes() {
    try {
      const res = await fetch("/api/clientes");
      const data = await res.json();

      setClientes(data);
      setClientesFiltrados(data);
    } catch (error) {
      console.error("Error cargando clientes", error);
    }
  }

  // 🔍 BUSCAR
  function buscar(valor: string) {
    setBusqueda(valor);

    if (!valor) {
      setClientesFiltrados(clientes);
      return;
    }

    const filtrados = clientes.filter((c) =>
      `${c.nombre} ${c.dni}`.toLowerCase().includes(valor.toLowerCase())
    );

    setClientesFiltrados(filtrados);
  }

  // 📸 MANEJAR FOTOS
  function manejarFotos(e: any) {
    const files = Array.from(e.target.files);
    setImagenes(files as File[]);

    const previews = files.map((file: any) =>
      URL.createObjectURL(file)
    );

    setPreview(previews);
  }

  function eliminarFoto(index: number) {
    const nuevas = [...imagenes];
    nuevas.splice(index, 1);
    setImagenes(nuevas);

    const nuevasPreview = [...preview];
    nuevasPreview.splice(index, 1);
    setPreview(nuevasPreview);
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

            // 🔥 AGREGAR FOTOS
            imagenes.forEach((img) => {
              form.append("fotos", img);
            });

            const res = await fetch("/api/orden", {
              method: "POST",
              body: form,
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
              setError(data.error || "Error al guardar orden");
              return;
            }

            // ✅ WHATSAPP
            const msg = `Hola, tu equipo fue registrado en el taller ✅
Código: ${data.codigo}`;

            window.open(
              `https://wa.me/51${data.telefono}?text=${encodeURIComponent(msg)}`
            );

            // 🧾 TICKET
            const ticket = `
--------------------------------
        SHINHWA REPAIR
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

            window.location.href = "/ordenes?ok=1";
          } catch (err) {
            console.error(err);
            setError("Error de conexión");
          }
        }}
      >
        {/* 🔍 BUSCAR */}
        <input
          value={busqueda}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Buscar cliente por DNI o nombre"
          style={inputStyle}
        />

        {/* LISTA */}
        {clientesFiltrados.length > 0 && (
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 6,
              marginTop: 5,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {clientesFiltrados.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setClienteId(c.id);
                  setClienteNombre(c.nombre);
                  setBusqueda(c.nombre);
                  setClientesFiltrados([]);
                }}
                style={{
                  padding: 12,
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  fontSize: 16,
                }}
              >
                {c.nombre} - {c.dni}
              </div>
            ))}
          </div>
        )}

        {/* CLIENTE */}
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

        {/* 📸 INPUT CÁMARA PRO */}
        <input
          type="file"
          multiple
          accept="image/*"
          capture="environment"
          onChange={manejarFotos}
          style={inputStyle}
        />

        {/* 🖼 PREVIEW */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {preview.map((img, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={img}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />

              <button
                type="button"
                onClick={() => eliminarFoto(i)}
                style={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* BOTÓN */}
        <button
          style={{
            marginTop: 15,
            padding: 15,
            fontSize: 16,
            borderRadius: 8,
            width: "100%",
            background: "#2563eb",
            color: "white",
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