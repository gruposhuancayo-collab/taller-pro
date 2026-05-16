import { NextRequest, NextResponse } from "next/server";

const PASSWORD = "123456";

export function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname;

  // ✅ PERMITIR SEGUIMIENTO
  if (
    path.startsWith("/seguimiento")
  ) {
    return NextResponse.next();
  }

  // ✅ LEER COOKIE
  const auth =
    req.cookies.get("shinhwa_admin");

  // ✅ SI YA ESTÁ LOGUEADO
  if (auth?.value === PASSWORD) {
    return NextResponse.next();
  }

  // ✅ LOGIN PAGE
  if (path === "/login") {
    return NextResponse.next();
  }

  // ❌ REDIRIGIR A LOGIN
  return NextResponse.redirect(
    new URL("/login", req.url)
  );
}