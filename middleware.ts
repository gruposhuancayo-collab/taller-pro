import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname;

  // 🔒 SI ES SEGUIMIENTO
  if (path.startsWith("/seguimiento")) {

    // ❌ BLOQUEAR ACCESO A ADMIN
    if (
      path.includes("/ordenes") ||
      path.includes("/clientes") ||
      path.includes("/admin")
    ) {
      return NextResponse.redirect(
        new URL("/seguimiento", req.url)
      );
    }
  }

  return NextResponse.next();
}