import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const {
      id,
      tipo,
    } = await req.json();

    const producto =
      await prisma.productoStock.findUnique({
        where: {
          id,
        },
      });

    if (!producto) {
      return NextResponse.json({
        ok: false,
      });
    }

    const nuevoStock =
      tipo === "SUMAR"
        ? producto.stock + 1
        : producto.stock - 1;

    const actualizado =
      await prisma.productoStock.update({
        where: {
          id,
        },
        data: {
          stock:
            nuevoStock < 0
              ? 0
              : nuevoStock,
        },
      });

    return NextResponse.json({
      ok: true,
      producto: actualizado,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      ok: false,
    });
  }
}