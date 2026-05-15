"use client";

import { useState, useEffect } from "react";

export default function NuevaOrdenPage() {
  const [busqueda, setBusqueda] = useState("");
  const [clientes, setClientes] = useState<any[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");

  // 📸 FOTOS
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = {
    width: "100%",
    padding: 16,
    marginTop: 10,
    borderRadius: 10,
    border: "2px solid black",
    fontSize: 18,
    background: "white",
    color: "black",
    opacity: 1,
    boxSizing: "border-box" as const,
  };

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
      console.error(error);
    }
  }

  function buscar(valor: string) {
    setBusqueda(valor);

    if (!valor.trim()) {
      setClientesFiltrados([]);
      return;
    }

    const filtrados = clientes.filter((c) =>
      `${c.nombre} ${c.dni}`
        .toLowerCase()
        .includes(valor.toLowerCase())
    );

    setClientesFiltrados(filtrados);
  }

  // 📸 AGREGAR FOTO
  function manejarFotos(e: any) {
    const file = e.target.files?.[0];

    if (!file) return;

    // 🔥 evitar archivos enormes
    if (file.size > 5 * 1024 * 1024) {
      alert("La foto es muy pesada");
      return;
    }

    setImagenes((prev) => [...prev, file]);

    const nuevaPreview = URL.createObjectURL(file);

    setPreview((prev) => [...prev, nuevaPreview]);

    // 🔥 limpiar input
    e.target.value = "";
  }

  function eliminarFoto(index: number) {
    const nuevas = [...imagenes];
    nuevas.splice(index, 1);

    setImagenes(nuevas);

    const nuevasPreview = [...preview];
    nuevasPreview.splice(index, 1);

    setPreview(nuevasPreview);
  }

  function validar(form: FormData) {
    if (!clienteId) {
      setError("Selecciona un cliente");
      return false;
    }

    if (!form.get("marca")) {
      setError("La marca es obligatoria");
      return false;
    }

    if (!form.get("problema")) {
      setError("Describe el problema");
      return false;
    }

    setError("");
    return true;
  }

  async function guardarOrden(e: any) {
    e.preventDefault();

    if (guardando) return;

    try {
      setGuardando(true);

      const form = new FormData(e.currentTarget);

      if (!validar(form)) {
        setGuardando(false);
        return;
      }

      // 🔥 agregar fotos una por una
      imagenes.forEach((img, index) => {
        form.append(`foto_${index}`, img);
      });

      const res = await fetch("/api/orden", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Error guardando orden");
        setGuardando(false);
        return;
      }

      // ✅ WhatsApp
      const msg =
        `Hola, tu equipo fue registrado correctamente ✅\n\n` +
        `Código: ${data.codigo}`;

      window.open(
        `https://wa.me/51${data.telefono}?text=${encodeURIComponent(msg)}`
      );

      // ✅ limpiar
      setImagenes([]);
      setPreview([]);

      // ✅ redireccionar
      window.location.href = "/ordenes";

    } catch (err) {
      console.error(err);

      setError("Error de conexión");

      setGuardando(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <h1
        style={{
          fontSize: 30,
          color: "white",
          marginBottom: 20,
        }}
      >
        🧾 Nueva Orden
      </h1>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: 12,
            borderRadius: 8,
            marginBottom: 15,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={guardarOrden}>

        {/* 🔍 BUSCADOR */}
        <input
          value={busqueda}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Buscar cliente por nombre o DNI"
          style={inputStyle}
        />

        {/* CLIENTES */}
        {clientesFiltrados.length > 0 && (
          <div
            style={{
              border: "2px solid black",
              borderRadius: 10,
              marginTop: 10,
              maxHeight: 250,
              overflowY: "auto",
              background: "white",
            }}
          >
            {clientesFiltrados.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setClienteId(c.id.toString());
                  setClienteNombre(c.nombre);
                  setBusqueda(c.nombre);
                  setClientesFiltrados([]);
                }}
                style={{
                  padding: 15,
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                  color: "black",
                  fontSize: 18,
                  background: "white",
                }}
              >
                <strong>{c.nombre}</strong>

                <br />

                DNI: {c.dni}
              </div>
            ))}
          </div>
        )}

        {/* CLIENTE */}
        {clienteNombre && (
          <div
            style={{
              marginTop: 15,
              padding: 15,
              background: "#dcfce7",
              borderRadius: 10,
              color: "black",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            ✅ Cliente seleccionado: {clienteNombre}
          </div>
        )}

        <input
          type="hidden"
          name="clienteId"
          value={clienteId}
        />

        {/* CAMPOS */}
        <input
          name="producto"
          defaultValue="Laptop"
          style={inputStyle}
        />

        <input
          name="marca"
          placeholder="Marca"
          style={inputStyle}
        />

        <input
          name="modelo"
          placeholder="Modelo"
          style={inputStyle}
        />

        <input
          name="serie"
          placeholder="Serie"
          style={inputStyle}
        />

        <textarea
          name="problema"
          placeholder="Problema del equipo"
          style={{
            ...inputStyle,
            height: 120,
          }}
        />

        {/* 📸 BOTÓN FOTO */}
        <label
          style={{
            marginTop: 15,
            display: "block",
            background: "#2563eb",
            color: "white",
            padding: 16,
            borderRadius: 10,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          📸 Agregar otra foto

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={manejarFotos}
            style={{ display: "none" }}
          />
        </label>

        {/* 🖼 PREVIEW */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 15,
          }}
        >
          {preview.map((img, i) => (
            <div
              key={i}
              style={{
                position: "relative",
              }}
            >
              <img
                src={img}
                style={{
                  width: 90,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "2px solid white",
                }}
              />

              <button
                type="button"
                onClick={() => eliminarFoto(i)}
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "none",
                  background: "red",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={guardando}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 18,
            borderRadius: 10,
            border: "none",
            background: guardando ? "#9ca3af" : "#16a34a",
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {guardando
            ? "Guardando..."
            : "💾 Guardar Orden"}
        </button>

      </form>
    </div>
  );
}