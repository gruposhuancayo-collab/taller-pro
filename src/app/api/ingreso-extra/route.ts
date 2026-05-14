export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const detalle = String(data.get("detalle"));
    const monto = Number(data.get("monto"));

    if (!detalle || !monto) {
      return NextResponse.json(
        { ok: false, error: "Datos inválidos" },
        { status: 400 }
      );
    }

    await prisma.ingresoExtra.create({
      data: {
        detalle,
        monto,
      },
    });

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error al guardar ingreso extra" },
      { status: 500 }
    );
  }
}