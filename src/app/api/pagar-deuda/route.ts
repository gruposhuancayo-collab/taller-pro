import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    // ✅ BUSCAR ORDEN
    const orden = await prisma.orden.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        cliente: true,
      },
    });

    if (!orden) {
      return NextResponse.json({
        ok: false,
        error: "Orden no encontrada",
      });
    }

    // ✅ VALIDAR DEUDA
    if (!orden.deuda || orden.deuda <= 0) {
      return NextResponse.json({
        ok: false,
        error: "La orden no tiene deuda",
      });
    }

    // ✅ GUARDAR PAGO
    await prisma.pago.create({
      data: {
        ordenId: orden.id,
        monto: orden.deuda,
        metodo: "EFECTIVO",
      },
    });

    // ✅ ACTUALIZAR ORDEN
    await prisma.orden.update({
      where: {
        id: orden.id,
      },
      data: {
        deuda: 0,
        fechaPago: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      telefono: orden.cliente?.celular,
      whatsapp: `Hola ${orden.cliente?.nombre} 👋

Tu deuda fue marcada como PAGADA ✅

Gracias.`,
    });

  } catch (error) {
    console.log("ERROR PAGAR DEUDA:");
    console.log(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Error servidor",
      },
      {
        status: 500,
      }
    );
  }
}