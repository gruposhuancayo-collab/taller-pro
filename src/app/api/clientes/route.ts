export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const clientes = await prisma.cliente.findMany({
    where: {
      OR: [
        { nombre: { contains: q, mode: "insensitive" } },
        { dni: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { id: "desc" },
  });

  return Response.json(clientes);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.nombre || !data.dni) {
      return Response.json(
        { error: "Nombre y DNI son obligatorios" },
        { status: 400 }
      );
    }

    const nuevo = await prisma.cliente.create({
      data: {
        nombre: data.nombre,
        dni: data.dni,
        celular: data.celular || "",
      },
    });

    return Response.json({ ok: true, cliente: nuevo });
  } catch (error) {
    console.error("ERROR API CLIENTES:", error);

    return Response.json(
      { error: "Error al guardar cliente" },
      { status: 500 }
    );
  }
}