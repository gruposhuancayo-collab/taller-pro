"use client";

export default function BotonImprimir({
  orden,
}: any) {

  function imprimir() {

    const ticket = `
${orden.cliente?.nombre || ""}
Cel: ${orden.cliente?.celular || ""}

${orden.marca || ""} ${orden.modelo || ""}
S/N: ${orden.serie || "-"}

${orden.problema || "-"}

_______________________________
PRECIO:

_______________________________
OBS:


`;

    const ventana = window.open(
      "",
      "",
      "width=320,height=600"
    );

    if (!ventana) return;

    ventana.document.write(`
<html>
<head>
<title>Print</title>

<style>

@page{
  size:80mm auto;
  margin:2mm;
}

html,body{
  width:80mm;
  margin:0;
  padding:0;
  font-family:Arial;
  font-size:13px;
}

body{
  padding:2mm;
}

.ticket{
  width:100%;
}

.nombre{
  font-size:15px;
  font-weight:bold;
}

.problemaTitulo{
  font-weight:bold;
  font-size:14px;
}

.problema{
  font-size:15px;
  font-weight:bold;
}

.linea{
  margin-top:8px;
}

</style>
</head>

<body onload="window.print();setTimeout(()=>window.close(),500)">

<div class="ticket">

<div class="nombre">
${orden.cliente?.nombre || ""}
</div>

<div>
Cel: ${orden.cliente?.celular || ""}
</div>

<div>
${orden.marca || ""} ${orden.modelo || ""}
</div>

<div>
S/N: ${orden.serie || "-"}
</div>

<div class="linea problemaTitulo">
PROBLEMA DEL EQUIPO
</div>

<div class="problema">
${orden.problema || "-"}
</div>

<div class="linea">
_______________________________
</div>

<div>
PRECIO:
</div>

<div class="linea">
_______________________________
</div>

<div>
OBS:
</div>

<br>
<br>
<br>

</div>

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