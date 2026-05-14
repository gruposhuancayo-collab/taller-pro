export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.formData();

  const id = Number(data.get("id"));
  const url = String(data.get("url"));

  const orden = await prisma.orden.update({
    where: { id },
    data: {
      fotos: {
        push: url,
      },
    },
  });

  return NextResponse.json({ ok: true, orden });
}