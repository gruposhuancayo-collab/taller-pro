"use client";

import { useEffect, useState } from "react";

export default function ClientesPage() {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🎨 estilo reutilizable
  const inputStyle = {
    width: "100%",
    padding: 18,
    fontSize: 22,
    borderRadius: 10,
    border: "2px solid black",
    background: "white",
    color: "black",
    opacity: 1,
  };

  // 🔍 Cargar clientes
  async function cargarClientes() {
    try {
      setLoading(true);
      const res = await fetch("/api/clientes");
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      alert("Error cargando clientes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarClientes();
  }, []);

  // 💾 Guardar cliente
  async function guardar(e: any) {
    e.preventDefault();

    if (!dni || !nombre || !celular) {
      alert("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni, nombre, celular }),
      });

      if (!res.ok) {
        throw new Error("Error al guardar");
      }

      setDni("");
      setNombre("");
      setCelular("");

      await cargarClientes();
    } catch (error) {
      alert("Error al guardar cliente");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>👥 Clientes</h1>

      {/* FORMULARIO */}
      <form
        onSubmit={guardar}
        style={{
          display: "grid",
          gap: 10,
          marginBottom: 30,
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        }}
      >
        <input
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Celular"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            background: loading ? "#9ca3af" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Guardando..." : "💾 Guardar cliente"}
        </button>
      </form>

      {/* LISTADO */}
      <div>
        <h2 style={{ marginBottom: 10 }}>Lista de clientes</h2>

        {loading && <p>Cargando...</p>}

        {!loading && clientes.length === 0 && (
          <p>No hay clientes registrados</p>
        )}

        <div style={{ display: "grid", gap: 10 }}>
          {clientes.map((c) => (
            <div
              key={c.id}
              style={{
                border: "1px solid #e5e7eb",
                padding: 15,
                borderRadius: 8,
                background: "#fff",
              }}
            >
              <strong style={{ fontSize: 16 }}>{c.nombre}</strong>
              <p style={{ margin: 0 }}>DNI: {c.dni}</p>
              <p style={{ margin: 0 }}>Celular: {c.celular}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}