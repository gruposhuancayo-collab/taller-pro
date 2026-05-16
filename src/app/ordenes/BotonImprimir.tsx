"use client";

export default function BotonImprimir({
  orden,
}: any) {

  function imprimir() {

    const ticket = `
================================

      SHINHWA REPAIR

================================

ORDEN DE SERVICIO

Código:
${orden.codigo}

Cliente:
${orden.cliente?.nombre || "-"}

Equipo:
${orden.producto || "-"}

Marca:
${orden.marca || "-"}

Modelo:
${orden.modelo || "-"}

Serie:
${orden.serie || "-"}

--------------------------------

Estado:
${orden.estado || "-"}

Fecha:
${new Date(
  orden.createdAt
).toLocaleString()}

================================

Gracias por preferir
SHINHWA REPAIR

================================
`;

    const printWindow =
      window.open(
        "",
        "",
        "width=400,height=800"
      );

    printWindow?.document.write(`
<html>
<head>
<title>Ticket</title>

<style>
body{
  font-family: monospace;
  width: 80mm;
  padding: 10px;
  font-size: 14px;
}

pre{
  white-space: pre-wrap;
}
</style>

</head>

<body>

<pre>${ticket}</pre>

<script>
window.print();
window.close();
</script>

</body>
</html>
`);
  }

  return (
    <button
      onClick={imprimir}
      style={{
        background: "#f59e0b",
        color: "white",
        border: "none",
        borderRadius: 10,
        width: 50,
        cursor: "pointer",
        fontSize: 20,
        fontWeight: "bold",
      }}
    >
      🖨️
    </button>
  );
}