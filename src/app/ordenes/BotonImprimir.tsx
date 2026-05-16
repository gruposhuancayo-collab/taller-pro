"use client";

export default function BotonImprimir({
  orden,
}: any) {

  function imprimir() {

    const ticket = `
${orden.codigo} ${new Date(
  orden.createdAt
).toLocaleDateString()}

${orden.cliente?.nombre || ""}
${orden.cliente?.celular || ""}

${orden.producto || ""}
██${orden.problema || ""}██

PRECIO:_______
OBS:__________
______________
`;

    const ventana = window.open(
      "",
      "",
      "width=300,height=600"
    );

    ventana?.document.write(`
<html>
<head>
<title>Ticket</title>

<style>
body{
  font-family: monospace;
  width: 80mm;
  margin:0;
  padding:4px;
  font-size:15px;
  font-weight:bold;
  line-height:1.1;
}

pre{
  white-space:pre-wrap;
  margin:0;
}

@media print{
  body{
    margin:0;
  }
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