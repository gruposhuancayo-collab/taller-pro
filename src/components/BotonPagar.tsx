"use client";

export default function BotonPagar({
  id,
  nombre,
}: {
  id: number;
  nombre: string;
}) {
  async function pagar() {
    const ok = confirm(
      `¿Marcar deuda pagada de ${nombre}?`
    );

    if (!ok) return;

    try {
      const res = await fetch("/api/pagar-deuda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await res.json();

      console.log(data);

      if (!data.ok) {
        alert(data.error || "Error");
        return;
      }

      // ✅ WHATSAPP
      if (data.whatsapp) {
        window.open(
          `https://wa.me/51${data.telefono}?text=${encodeURIComponent(
            data.whatsapp
          )}`
        );
      }

      // ✅ RECARGAR
      window.location.reload();

    } catch (error) {
      console.log(error);
      alert("Error servidor");
    }
  }

  return (
    <button
      onClick={pagar}
      style={{
        background: "#16a34a",
        color: "white",
        border: "none",
        padding: "10px 14px",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      ✅ PAGAR
    </button>
  );
}