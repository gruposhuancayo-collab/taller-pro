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

  const formData =
    await req.formData();

  const estado = String(
    formData.get("estado")
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
}