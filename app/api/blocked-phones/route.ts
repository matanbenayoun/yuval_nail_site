import { NextResponse } from "next/server"
import { getAll, add } from "@/lib/blocked-phones-store"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.authorized) return auth.response

  return NextResponse.json(getAll())
}

export async function POST(req: Request) {
  const auth = await requireAdmin()
  if (!auth.authorized) return auth.response

  const { phone, reason } = await req.json()
  if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 })
  const entry = add(phone, reason)
  return NextResponse.json(entry)
}
