import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  const params =
    await context.params;

  const id = Number(params.id);

  const body =
    await req.json();

  await prisma.orden.update({
    where: { id },
    data: {
      estado: body.estado,
      reparacion:
        body.reparacion || null,
      precio:
        body.precio || null,
      motivoNoReparado:
        body.motivo || null,
    },
  });

  return NextResponse.json({
    ok: true,
  });
}