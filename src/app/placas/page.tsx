import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PlacasPage() {

  // ✅ PRODUCTOS CON STOCK
  const productos =
    await prisma.productoStock.findMany({
      where: {
        stock: {
          gt: 0,
        },
      },

      orderBy: {
        id: "desc",
      },
    });

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: 30 }}>
          📦 Placas en Stock
        </h1>

        <Link href="/placas/nuevo">
          <button
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              border: "none",
              background: "#7c3aed",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ➕ Nuevo Producto
          </button>
        </Link>
      </div>

      {/* 🔍 BUSCADOR */}
      <input
        placeholder="🔍 Buscar producto..."
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 10,
          border: "1px solid #ddd",
          marginBottom: 20,
          fontSize: 16,
        }}
      />

      {/* PRODUCTOS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(250px,1fr))",
          gap: 20,
        }}
      >
        {productos.map((producto) => (
          <div
            key={producto.id}
            style={{
              background: "white",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            {/* LINK DETALLE */}
            <Link
              href={`/placas/${producto.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {/* IMAGEN */}
              <img
                src={
               producto.imagenes?.length > 0
               ? producto.imagenes[0]
               : "https://via.placeholder.com/600x400?text=Sin+Imagen"
               }
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: 15 }}>
                <h2>{producto.nombre}</h2>

                <p style={{ color: "#6b7280" }}>
                  {producto.descripcion}
                </p>

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <strong
                    style={{
                      color: "#16a34a",
                      fontSize: 22,
                    }}
                  >
                    S/ {producto.precio}
                  </strong>

                  <span>
                    Stock: {producto.stock}
                  </span>
                </div>
              </div>
            </Link>

            {/* 🔧 USAR */}
            <div style={{ padding: 15, paddingTop: 0 }}>
              <form
                action="/api/stock/usar"
                method="POST"
              >
                <input
                  type="hidden"
                  name="id"
                  value={producto.id}
                />

                <button
                  style={{
                    marginTop: 10,
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "none",
                    background: "#dc2626",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  🔧 USAR
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}