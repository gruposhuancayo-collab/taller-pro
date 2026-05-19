export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

async function subirImagen(file: File) {
  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "taller-pro",
        },
        (error, result) => {
          if (error || !result) {
            reject(error);
            return;
          }

          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

export async function POST(req: Request) {
  try {

    const data = await req.formData();

    const clienteId = Number(data.get("clienteId"));

    const producto = String(
      data.get("producto") || ""
    );

    const marca = String(
      data.get("marca") || ""
    );

    const modelo = String(
      data.get("modelo") || ""
    );

    const serie = String(
      data.get("serie") || ""
    );

    const problema = String(
      data.get("problema") || ""
    );

    // VALIDAR
    if (!clienteId || !marca || !problema) {

      return NextResponse.json(
        {
          ok: false,
          error: "Datos incompletos",
        },
        {
          status: 400,
        }
      );
    }

    // CLIENTE
    const cliente =
      await prisma.cliente.findUnique({
        where: {
          id: clienteId,
        },
      });

    if (!cliente) {

      return NextResponse.json(
        {
          ok: false,
          error: "Cliente no existe",
        },
        {
          status: 404,
        }
      );
    }

    // SUBIR FOTOS
    const fotos: string[] = [];

    for (const value of data.values()) {

      if (value instanceof File) {

        if (value.size > 0) {

          const url =
            await subirImagen(value);

          fotos.push(url);
        }
      }
    }

    // CÓDIGO ORDEN
    const codigo =
      `ORD-${Date.now()}`;

    // CREAR ORDEN
    const orden =
      await prisma.orden.create({
        data: {
          clienteId,
          producto,
          marca,
          modelo,
          serie,
          problema,
          codigo,
          estado: "RECIBIDO",
          fotos,
        },
      });

    // RESPUESTA
    return NextResponse.json({
      ok: true,
      id: orden.id,
      codigo: orden.codigo,
      telefono:
        cliente.celular || "",
    });

  } catch (error) {

    console.error(
      "ERROR ORDEN:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Error al guardar orden",
      },
      {
        status: 500,
      }
    );
  }
}