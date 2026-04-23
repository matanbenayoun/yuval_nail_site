import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/admin/login" || pathname.startsWith("/api/admin")) {
    return NextResponse.next()
  }

  const sessionSecret = process.env.ADMIN_SESSION_SECRET
  const authCookie = request.cookies.get("admin_auth")

  if (!sessionSecret || !authCookie?.value || authCookie.value !== sessionSecret) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
