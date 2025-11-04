import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Rutas que requieren autenticación
  const protectedRoutes = ["/dashboard", "/profile"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Verificar si hay sesión en las cookies
    const authToken = request.cookies.get("sb-auth-token");

    if (!authToken) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
