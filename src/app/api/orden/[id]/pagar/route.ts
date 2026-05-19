import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {

    const id = Number(params.id);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        {
          ok: false,
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );
    }

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

  } catch (error) {

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