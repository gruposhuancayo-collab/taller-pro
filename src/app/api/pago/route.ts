import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const ordenId = Number(data.get("ordenId"));
    const monto = Number(data.get("monto"));
    const metodo = String(data.get("metodo"));

    const orden = await prisma.orden.findUnique({
      where: { id: ordenId },
      include: { cliente: true },
    });

    if (!orden) {
      return NextResponse.json({ error: "Orden no existe" }, { status: 404 });
    }

    const nuevaDeuda = (orden.deuda || 0) - monto;

    // guardar pago
    await prisma.pago.create({
      data: {
        ordenId,
        monto,
        metodo,
      },
    });

    // actualizar deuda
    await prisma.orden.update({
      where: { id: ordenId },
      data: {
        deuda: nuevaDeuda < 0 ? 0 : nuevaDeuda,
      },
    });

    const msg = `Hola ${orden.cliente.nombre}
Recibimos tu pago ✅

💰 Monto: S/ ${monto}
💳 Método: ${metodo}

📉 Deuda restante: S/ ${nuevaDeuda < 0 ? 0 : nuevaDeuda}

Gracias 👍`;

    return NextResponse.json({
      ok: true,
      deuda: nuevaDeuda < 0 ? 0 : nuevaDeuda,
      telefono: orden.cliente.celular,
      msg,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al registrar pago" }, { status: 500 });
  }
}