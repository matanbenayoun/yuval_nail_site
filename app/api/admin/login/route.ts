import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const { username, password } = await req.json()

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const cookieStore = await cookies()
    cookieStore.set("admin_auth", process.env.ADMIN_SESSION_SECRET || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "שם משתמש או סיסמה שגויים" }, { status: 401 })
}
