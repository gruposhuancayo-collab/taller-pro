export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const clienteId = Number(data.get("clienteId"));
    const producto = String(data.get("producto") || "");
    const marca = String(data.get("marca") || "");
    const modelo = String(data.get("modelo") || "");
    const serie = String(data.get("serie") || "");
    const problema = String(data.get("problema") || "");

    // 🔥 IGNORAR FOTOS COMPLETAMENTE
    // para que Android no rompa el guardado

    if (!clienteId || !marca || !problema) {
      return NextResponse.json(
        {
          ok: false,
          error: "Datos incompletos",
        },
        {
          status: 400,
        }
      );
    }

    const cliente = await prisma.cliente.findUnique({
      where: {
        id: clienteId,
      },
    });

    if (!cliente) {
      return NextResponse.json(
        {
          ok: false,
          error: "Cliente no existe",
        },
        {
          status: 404,
        }
      );
    }

    const codigo = `ORD-${Date.now()}`;

    const orden = await prisma.orden.create({
      data: {
        clienteId,
        producto,
        marca,
        modelo,
        serie,
        problema,
        codigo,
        estado: "RECIBIDO",
      },
    });

    return NextResponse.json({
      ok: true,
      codigo: orden.codigo,
      telefono: cliente.celular || "",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Error al guardar orden",
      },
      {
        status: 500,
      }
    );
  }
}