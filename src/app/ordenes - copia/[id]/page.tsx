import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DetalleClient from "./DetalleClient";

export default async function OrdenDetalle({ params }: any) {
  // 🔥 FIX NUEVO NEXTJS
  const resolvedParams = await params;

  const id = Number(resolvedParams.id);

  if (!id || isNaN(id)) {
    return notFound();
  }

  const orden = await prisma.orden.findUnique({
    where: { id },
    include: { cliente: true },
  });

  if (!orden) return notFound();

  return <DetalleClient orden={orden} />;
}