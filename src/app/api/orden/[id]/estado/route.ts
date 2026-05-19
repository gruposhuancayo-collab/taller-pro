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

    const formData =
      await req.formData();

    const estado = String(
      formData.get("estado") || ""
    );

    await prisma.orden.update({
      where: { id },
      data: {
        estado,
      },
    });

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