import { prisma } from "@/lib/prisma";

export default async function DetalleProducto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ✅ VALIDAR ID
  if (isNaN(Number(id))) {
    return (
      <div style={{ padding: 20 }}>
        <h1>ID inválido</h1>
      </div>
    );
  }

  const producto =
    await prisma.productoStock.findUnique({
      where: {
        id: Number(id),
      },
    });

  if (!producto) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Producto no encontrado</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 1000,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 30 }}>
        {producto.nombre}
      </h1>

      {/* 📸 CARRUSEL */}
      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          marginTop: 20,
        }}
      >
        {producto.imagenes?.map(
          (img: string, i: number) => (
            <a
              key={i}
              href={img}
              target="_blank"
            >
              <img
                src={img}
                style={{
                  width: 300,
                  height: 300,
                  objectFit: "cover",
                  borderRadius: 10,
                  cursor: "zoom-in",
                  border: "1px solid #ddd",
                }}
              />
            </a>
          )
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>
          💰 Precio: S/ {producto.precio}
        </h2>

        <h3>
          📦 Stock: {producto.stock}
        </h3>

        <p style={{ marginTop: 15 }}>
          {producto.descripcion}
        </p>
      </div>
    </div>
  );
}