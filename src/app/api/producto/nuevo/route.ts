import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const producto =
      await prisma.productoStock.create({
        data: {
          nombre: body.nombre,
          descripcion: body.descripcion,
          precio: body.precio,
          stock: body.stock,
          fotos: body.fotos,
        },
      });

    return NextResponse.json({
      ok: true,
      producto,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      ok: false,
    });
  }
}