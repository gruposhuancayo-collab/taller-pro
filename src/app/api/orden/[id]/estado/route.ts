```ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: any
) {

  const id = Number(
    context.params.id
  );

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
```
