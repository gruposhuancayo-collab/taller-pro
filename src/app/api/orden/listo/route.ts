export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const id = Number(data.get("id"));
    const reparacion = String(data.get("reparacion"));
    const precio = Number(data.get("precio"));
    const tipoPago = String(data.get("tipoPago"));

    // 🔢 RECIBO
    const last = await prisma.orden.findFirst({
      orderBy: { recibo: "desc" },
    });

    const recibo = (last?.recibo || 0) + 1;

    const deuda = tipoPago === "CREDITO" ? precio : 0;

    const orden = await prisma.orden.update({
      where: { id },
      data: {
        estado: "LISTO",
        reparacion,
        precio,
        tipoPago,
        deuda,
        recibo,
      },
      include: { cliente: true },
    });

    // 📲 MENSAJE COMPLETO
    const msg = `Hola ${orden.cliente.nombre} 👋
Tu equipo ya está listo ✅

💻 ${orden.marca} ${orden.modelo || ""}

🔧 Reparación:
${reparacion}

💰 Total: S/ ${precio}
💳 Pago: ${tipoPago}

🧾 Recibo N°: ${recibo}

Gracias por confiar en TALLER PRO`;

    return NextResponse.json({
      ok: true,
      telefono: orden.cliente.celular,
      msg,
      recibo,
      reparacion,
      precio,
      tipoPago,
    });

  } catch (error) {
    console.error("ERROR FINAL:", error);

    return NextResponse.json(
      { ok: false, error: "Error al finalizar orden" },
      { status: 500 }
    );
  }
}