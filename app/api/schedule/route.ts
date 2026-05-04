import { NextResponse } from "next/server"
import { getAll, create } from "@/lib/schedule-store"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET() {
  return NextResponse.json(getAll())
}

export async function POST(req: Request) {
  const auth = await requireAdmin()
  if (!auth.authorized) return auth.response

  const { date, time, reason } = await req.json()
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 })
  const block = create({ date, time, reason })
  return NextResponse.json(block)
}
