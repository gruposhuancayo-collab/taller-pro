"use client";

export default function BotonImprimir({
  orden,
}: any) {

  function imprimir() {

    const ticket = `
${orden.codigo}    ${new Date(
  orden.createdAt
).toLocaleDateString()}

CLIENTE:
${orden.cliente?.nombre || ""}

CEL:
${orden.cliente?.celular || ""}

EQUIPO:
${orden.producto || ""}

████████████████████████
${orden.problema || ""}
████████████████████████

PRECIO: __________________

OBS: ____________________

_________________________

`;
    const ventana = window.open(
      "",
      "PRINT",
      "height=600,width=400"
    );

    if (!ventana) return;

    ventana.document.write(`
<html>
<head>
<title>PRINT</title>

<style>

@page{
  size:80mm auto;
  margin:0;
}

html,body{
  width:80mm;
  margin:0;
  padding:0;
}

body{
  font-family: monospace;
  font-size:18px;
  font-weight:bold;
  line-height:1.15;
  padding:6px;
}

pre{
  margin:0;
  white-space:pre-wrap;
  word-break:break-word;
}

</style>
</head>

<body>

<pre>${ticket}</pre>

<script>
window.focus();

setTimeout(() => {
  window.print();
}, 300);

setTimeout(() => {
  window.close();
}, 1000);
</script>

</body>
</html>
`);

    ventana.document.close();
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