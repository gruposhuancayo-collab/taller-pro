import { NextRequest, NextResponse } from "next/server";

const PASSWORD = "123456";

export function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname;

  // ✅ DEJAR LIBRE SEGUIMIENTO
  if (
    path.startsWith("/seguimiento")
  ) {
    return NextResponse.next();
  }

  // ✅ DEJAR LIBRE LOGIN
  if (
    path.startsWith("/login")
  ) {
    return NextResponse.next();
  }

  // ✅ LEER COOKIE
  const auth =
    req.cookies.get("shinhwa_admin");

  // ✅ SI ESTÁ AUTENTICADO
  if (auth?.value === PASSWORD) {
    return NextResponse.next();
  }

  // ❌ SI NO -> LOGIN
  return NextResponse.redirect(
    new URL("/login", req.url)
  );
}

// 🔥 IMPORTANTE
export const config = {
  matcher: [
    "/ordenes/:path*",
    "/clientes/:path*",
    "/dashboard/:path*",
    "/",
  ],
};