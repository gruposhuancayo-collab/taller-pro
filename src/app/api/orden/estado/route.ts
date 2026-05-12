import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      id,
      estado,
      motivo,
      precio,
      problema,
      tipoPago,
    } = await req.json();

    const orden = await prisma.orden.findUnique({
      where: { id },
      include: {
        cliente: true,
      },
    });

    if (!orden) {
      return NextResponse.json({
        ok: false,
        error: "No existe orden",
      });
    }

    const telefono = orden.cliente?.celular;

    // ✅ REPARACIÓN NORMAL
    if (estado === "LISTO") {
      const fechaGarantia = new Date(
        new Date().setMonth(new Date().getMonth() + 6)
      );

      const ordenActualizada = await prisma.orden.update({
        where: { id },
        data: {
          estado: "LISTO",
          problema,
          precio,
          tipoPago,
          fechaGarantia,
          enGarantia: true,
          deuda: tipoPago === "CREDITO" ? precio : 0,
        },

        // 🔥 IMPORTANTE
        include: {
          cliente: true,
        },
      });

      return NextResponse.json({
        ok: true,
        telefono,
        whatsapp: `Tu equipo está listo para recoger ✅

🔧 Reparación:
${problema}

💰 Total: S/ ${precio}`,

        orden: ordenActualizada,
      });
    }

    // 🔄 INGRESÓ POR GARANTÍA
    if (estado === "GARANTIA") {
      const ordenActualizada = await prisma.orden.update({
        where: { id },
        data: {
          estado: "GARANTIA",
        },

        // 🔥 IMPORTANTE
        include: {
          cliente: true,
        },
      });

      return NextResponse.json({
        ok: true,
        telefono,
        whatsapp: `Tu equipo ingresó por garantía 🔄

Lo revisaremos y te avisaremos cuando esté listo.`,

        orden: ordenActualizada,
      });
    }

    // 🔄 GARANTÍA REPARADA
    if (estado === "GARANTIA_REPARADA") {
      const ordenActualizada = await prisma.orden.update({
        where: { id },
        data: {
          estado: "LISTO",
          problema,
          precio: 0,
          tipoPago: "GARANTIA",
          enGarantia: true,
        },

        // 🔥 IMPORTANTE
        include: {
          cliente: true,
        },
      });

      return NextResponse.json({
        ok: true,
        telefono,
        whatsapp: `Tu equipo fue reparado por garantía 🔄

🔧 Reparación:
${problema}

Puedes pasar a recogerlo.`,

        orden: ordenActualizada,
      });
    }

    // ❌ NO REPARADO
    if (estado === "NO_REPARADO") {
      await prisma.orden.update({
        where: { id },
        data: {
          estado: "NO_REPARADO",
          motivoNoReparado: motivo,
        },
      });

      return NextResponse.json({
        ok: true,
        telefono,
        whatsapp: `Tu equipo no pudo ser reparado ⚠️

Motivo:
${motivo}`,
      });
    }

    return NextResponse.json({
      ok: false,
      error: "Estado inválido",
    });
  } catch (error) {
    console.error("ERROR ESTADO:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Error servidor",
      },
      { status: 500 }
    );
  }
}