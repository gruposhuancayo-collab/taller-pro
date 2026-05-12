import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const deudores = await prisma.orden.findMany({
    where: {
      deuda: { gt: 0 },
    },
    include: { cliente: true },
  });

  const links = deudores.map((o) => {
    const msg = `Hola ${o.cliente.nombre}, tienes una deuda de S/ ${o.deuda}`;
    return `https://wa.me/51${o.cliente.celular}?text=${encodeURIComponent(msg)}`;
  });

  return NextResponse.json({ links });
}