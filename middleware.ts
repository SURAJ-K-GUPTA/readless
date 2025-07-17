import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Protect /api/bookmark and /api/user/me routes
  if (
    request.nextUrl.pathname.startsWith("/api/bookmark") ||
    request.nextUrl.pathname.startsWith("/api/user/me") ||
    request.nextUrl.pathname.startsWith("/api/user/logout")
  ) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/bookmark/:path*", "/api/user/me/:path*", "/api/user/logout/:path*"],
}; 