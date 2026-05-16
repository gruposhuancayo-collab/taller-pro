import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  const pathname =
    request.nextUrl.pathname;

  // ✅ CLIENTES
  if (
    pathname.startsWith("/seguimiento")
  ) {
    return NextResponse.next();
  }

  // ✅ LOGIN LIBRE
  if (
    pathname.startsWith("/login")
  ) {
    return NextResponse.next();
  }

  // ✅ VERIFICAR COOKIE
  const auth =
    request.cookies.get("shinhwa_admin");

  // ✅ SI ESTÁ LOGUEADO
  if (
    auth?.value === "123456"
  ) {
    return NextResponse.next();
  }

  // ❌ BLOQUEAR TODO
  return NextResponse.redirect(
    new URL("/login", request.url)
  );
}

export const config = {
  matcher: [
    "/ordenes/:path*",
    "/clientes/:path*",
    "/dashboard/:path*",
    "/",
  ],
};