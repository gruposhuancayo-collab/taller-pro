"use client";

export default function IngresoExtraBtn() {
  return (
    <button
      onClick={async () => {
        const detalle = prompt("🧾 Detalle del ingreso");
        if (!detalle) return;

        const montoInput = prompt("💰 Monto");
        if (!montoInput) return;

        const form = new FormData();
        form.append("detalle", detalle);
        form.append("monto", montoInput);

        await fetch("/api/ingreso-extra", {
          method: "POST",
          body: form,
        });

        location.reload();
      }}
      style={{
        marginTop: 10,
        background: "#111",
        color: "white",
        padding: 10,
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
      }}
    >
      ➕ Ingreso extra
    </button>
  );
}