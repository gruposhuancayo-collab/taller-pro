"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoProducto() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // 📸 ARCHIVOS
  const [files, setFiles] = useState<FileList | null>(
    null
  );

  async function guardar() {
    try {
      setLoading(true);

      // ✅ SUBIR IMÁGENES
      const imagenesSubidas: string[] = [];

      if (files) {
        for (const file of Array.from(files)) {
          const form = new FormData();

          form.append("file", file);

          const upload = await fetch("/api/upload", {
            method: "POST",
            body: form,
          });

          const upData = await upload.json();

          if (upData.ok) {
            imagenesSubidas.push(upData.url);
          }
        }
      }

      // ✅ GUARDAR PRODUCTO
      const res = await fetch("/api/placas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          nombre,
          precio: Number(precio),
          stock: Number(stock),
          descripcion,
          imagenes: imagenesSubidas,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        alert(data.error || "Error");
        return;
      }

      alert("✅ Producto creado");

      router.push("/placas");

    } catch (error) {
      console.log(error);
      alert("Error servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "auto",
        padding: 20,
      }}
    >
      <h1 style={{ fontSize: 28 }}>
        📦 Nuevo Producto
      </h1>

      <div
        style={{
          display: "grid",
          gap: 12,
          marginTop: 20,
        }}
      >
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
          style={input}
        />

        <input
          placeholder="Precio"
          type="number"
          value={precio}
          onChange={(e) =>
            setPrecio(e.target.value)
          }
          style={input}
        />

        <input
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
          style={input}
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) =>
            setDescripcion(e.target.value)
          }
          style={{
            ...input,
            minHeight: 120,
          }}
        />

        {/* 📸 IMÁGENES */}
        <div style={{ marginTop: 15 }}>
          <label>📸 Imágenes</label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setFiles(e.target.files)
            }
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
            }}
          />
        </div>

        <button
          onClick={guardar}
          disabled={loading}
          style={{
            padding: 15,
            borderRadius: 10,
            border: "none",
            background: "#7c3aed",
            color: "white",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          {loading
            ? "Guardando..."
            : "💾 Guardar Producto"}
        </button>
      </div>
    </div>
  );
}

const input = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 16,
  width: "100%",
};