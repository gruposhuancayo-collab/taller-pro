import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const producto =
      await prisma.productoStock.create({
        data: {
          nombre: body.nombre,
          precio: Number(body.precio),
          stock: Number(body.stock),
          descripcion: body.descripcion,
          imagenes: body.imagenes || [],
        },
      });

    return NextResponse.json({
      ok: true,
      producto,
    });

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