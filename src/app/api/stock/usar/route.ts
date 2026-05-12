import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const data = await req.formData();

  const id = Number(data.get("id"));

  const producto =
    await prisma.productoStock.findUnique({
      where: {
        id,
      },
    });

  if (!producto) {
    return Response.json({
      ok: false,
    });
  }

  await prisma.productoStock.update({
    where: {
      id,
    },

    data: {
      stock: {
        decrement: 1,
      },
    },
  });

  redirect("/placas");
}