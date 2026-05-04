import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function requireAdmin(): Promise<{ authorized: true } | { authorized: false; response: Response }> {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("admin_auth")
  const sessionSecret = process.env.ADMIN_SESSION_SECRET

  if (!sessionSecret || !authCookie?.value || authCookie.value !== sessionSecret) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }
  return { authorized: true }
}
