import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DetalleClient from "./DetalleClient";

export const dynamic = "force-dynamic";

export default async function OrdenDetalle({ params }: any) {
  // 🔥 IMPORTANTE
  const resolvedParams = await params;

  const id = Number(resolvedParams.id);

  // ✅ VALIDAR
  if (!id || isNaN(id)) {
    return notFound();
  }

  // ✅ BUSCAR ORDEN
  const orden = await prisma.orden.findUnique({
    where: { id },
    include: {
      cliente: true,
    },
  });

  // ✅ SI NO EXISTE
  if (!orden) {
    return notFound();
  }

  // ✅ MOSTRAR
  return <DetalleClient orden={orden} />;
}