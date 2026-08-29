import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/session";

function hasTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin/");

  if (isAdminApi && !["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
  }

  const authenticated = await verifyAdminToken(
    request.cookies.get(ADMIN_COOKIE_NAME)?.value
  );

  if (isLoginPage) {
    return authenticated
      ? NextResponse.redirect(new URL("/admin", request.url))
      : NextResponse.next();
  }

  if (isLoginApi) return NextResponse.next();

  if (!authenticated) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
