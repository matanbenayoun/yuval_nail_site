import { NextResponse } from "next/server"
import { remove } from "@/lib/blocked-phones-store"
import { requireAdmin } from "@/lib/admin-auth"

export async function DELETE(_req: Request, { params }: { params: Promise<{ phone: string }> }) {
  const auth = await requireAdmin()
  if (!auth.authorized) return auth.response

  const { phone } = await params
  const ok = remove(decodeURIComponent(phone))
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not found" }, { status: 404 })
}
