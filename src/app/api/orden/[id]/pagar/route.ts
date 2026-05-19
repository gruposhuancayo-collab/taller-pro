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

  const params = await context.params;

  const id = Number(params.id);

  const orden =
    await prisma.orden.findUnique({
      where: { id },
    });

  if (!orden) {
    return NextResponse.redirect(
      new URL("/ordenes", req.url)
    );
  }

  const monto =
    orden.deuda || orden.precio || 0;

  if (monto > 0) {

    await prisma.pago.create({
      data: {
        ordenId: id,
        monto,
        metodo: "EFECTIVO",
      },
    });

    await prisma.orden.update({
      where: { id },
      data: {
        deuda: 0,
        fechaPago: new Date(),
      },
    });
  }

  return NextResponse.redirect(
    new URL(`/ordenes/${id}`, req.url)
  );
}