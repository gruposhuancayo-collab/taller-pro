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
      "width=320,height=600"
    );

    ventana?.document.write(`
<html>
<head>
<title>Ticket</title>

<style>

@page{
  size: 80mm auto;
  margin: 0;
}

html,body{
  width:80mm;
  margin:0;
  padding:0;
  overflow:hidden;
}

body{
  font-family: monospace;
  font-size:15px;
  font-weight:bold;
  line-height:1.1;
  padding:4px;
  display:inline-block;
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
window.onload = () => {
  window.print();
  setTimeout(() => {
    window.close();
  }, 500);
};
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