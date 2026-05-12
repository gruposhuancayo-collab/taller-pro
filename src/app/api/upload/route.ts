import { writeFile, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file =
      formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          ok: false,
          error: "No file",
        },
        {
          status: 400,
        }
      );
    }

    // ✅ bytes
    const bytes =
      await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // ✅ nombre único
    const filename =
      `${Date.now()}-${file.name}`;

    // ✅ carpeta uploads
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    // ✅ crear carpeta si no existe
    await mkdir(uploadDir, {
      recursive: true,
    });

    // ✅ ruta final
    const filepath = path.join(
      uploadDir,
      filename
    );

    // ✅ guardar
    await writeFile(filepath, buffer);

    // ✅ url pública
    const url =
      `/uploads/${filename}`;

    return NextResponse.json({
      ok: true,
      url,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Error upload",
      },
      {
        status: 500,
      }
    );
  }
}