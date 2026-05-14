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

    if (!valor) {
      setClientesFiltrados(clientes);
      return;
    }

    const filtrados = clientes.filter((c) =>
      `${c.nombre} ${c.dni}`
        .toLowerCase()
        .includes(valor.toLowerCase())
    );

    setClientesFiltrados(filtrados);
  }

  // 📸 AGREGAR MÁS FOTOS
  function manejarFotos(e: any) {
    const files = Array.from(e.target.files) as File[];

    const nuevasImagenes = [...imagenes, ...files];

    setImagenes(nuevasImagenes);

    const nuevasPreview = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreview((prev) => [...prev, ...nuevasPreview]);
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

            // 📸 AGREGAR FOTOS
            imagenes.forEach((img) => {
              form.append("fotos", img);
            });

            const res = await fetch("/api/orden", {
              method: "POST",
              body: form,
            });

            const data = await res.json();

            if (!data.ok) {
              setError(data.error || "Error guardando");
              return;
            }

            // ✅ WHATSAPP
            const msg =
              `Hola, tu equipo fue registrado ✅\n` +
              `Código: ${data.codigo}`;

            window.open(
              `https://wa.me/51${data.telefono}?text=${encodeURIComponent(msg)}`
            );

            window.location.href = "/ordenes";

          } catch (err) {
            console.error(err);
            setError("Error de conexión");
          }
        }}
      >
        {/* 🔍 BUSCADOR */}
        <input
          value={busqueda}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Buscar cliente por nombre o DNI"
          style={inputStyle}
        />

        {/* LISTA CLIENTES */}
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
                  setClienteId(c.id);
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
            multiple
            onChange={manejarFotos}
            style={{ display: "none" }}
          />
        </label>

        {/* PREVIEW */}
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

        {/* GUARDAR */}
        <button
          type="submit"
          style={{
            marginTop: 20,
            width: "100%",
            padding: 18,
            borderRadius: 10,
            border: "none",
            background: "#16a34a",
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          💾 Guardar Orden
        </button>
      </form>
    </div>
  );
}