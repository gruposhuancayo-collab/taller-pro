import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname;

  // ✅ RUTAS PÚBLICAS
  if (
    path.startsWith("/login") ||
    path.startsWith("/seguimiento") ||
    path.startsWith("/_next") ||
    path.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // ✅ LEER COOKIE
  const auth =
    req.cookies.get("shinhwa_admin");

  // ✅ SI YA INICIÓ SESIÓN
  if (
    auth?.value === "123456"
  ) {
    return NextResponse.next();
  }

  // ❌ BLOQUEAR TODO
  return NextResponse.redirect(
    new URL("/login", req.url)
  );
}

// ✅ ACTIVAR EN TODO EL SISTEMA
export const config = {
  matcher: ["/:path*"],
};