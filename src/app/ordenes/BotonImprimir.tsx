"use client";

export default function BotonImprimir({
  orden,
}: any) {

  function imprimir() {

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
  line-height:1.1;
  padding:6px;
}

.contenido{
  width:100%;
}

.texto{
  margin-top:2px;
  margin-bottom:2px;
}

.problema{
  margin-top:4px;
  margin-bottom:4px;
  background:black;
  color:white;
  padding:4px;
  font-weight:bold;
  word-break:break-word;
}

.linea{
  margin-top:6px;
}

</style>
</head>

<body>

<div class="contenido">

<div class="texto">
${orden.codigo} - ${new Date(
      orden.createdAt
    ).toLocaleDateString()}
</div>

<div class="texto">
${orden.cliente?.nombre || ""}
</div>

<div class="texto">
${orden.cliente?.celular || ""}
</div>

<div class="texto">
${orden.producto || ""}
</div>

<div class="problema">
${orden.problema || ""}
</div>

<div class="linea">
PRECIO: ______________________
</div>

<div class="linea">
OBS: _________________________
</div>

<div class="linea">
______________________________
</div>

</div>

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