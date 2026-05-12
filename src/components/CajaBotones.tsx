"use client";

export default function CajaBotones() {
  return (
    <>
      {/* 📤 EXPORTAR */}
      <button
        onClick={() => window.print()}
        style={{
          marginTop: 10,
          padding: 14,
          fontSize: 16,
          borderRadius: 8,
          width: "100%",
          background: "#16a34a",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        📄 Exportar / Imprimir
      </button>

      {/* 🔒 CERRAR CAJA */}
      <button
        style={{
          marginTop: 10,
          padding: 14,
          fontSize: 16,
          borderRadius: 8,
          width: "100%",
          background: "#111827",
          color: "white",
          border: "none",
        }}
        onClick={() => alert("Caja cerrada (solo referencia mensual)")}
      >
        🔒 Cerrar Caja (opcional)
      </button>
    </>
  );
}