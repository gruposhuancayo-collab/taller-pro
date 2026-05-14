export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const clientes = await prisma.cliente.findMany({
      where: {
        OR: [
          {
            nombre: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            dni: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        id: "desc",
      },
    });

    return Response.json(clientes);

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: "error clientes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {

    const data = await req.json();

    const nuevo = await prisma.cliente.create({
      data: {
        nombre: data.nombre,
        dni: data.dni,
        celular: data.celular || "",
      },
    });

    return Response.json({
      ok: true,
      cliente: nuevo,
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: "error crear cliente" },
      { status: 500 }
    );
  }
}