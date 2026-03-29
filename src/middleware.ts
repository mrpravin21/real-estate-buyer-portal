import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyJwtHs256Edge } from "@/lib/auth/jwt-edge-verify";
import { AUTH_COOKIE } from "@/lib/constants";

async function isAuthenticated(
  request: NextRequest
): Promise<boolean> {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret || secret.length < 16) return false;
  return verifyJwtHs256Edge(token, secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = await isAuthenticated(request);

  if (pathname.startsWith("/dashboard")) {
    if (!authed) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (
    authed &&
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/register/photo")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/register/photo",
  ],
};
