import { NextResponse } from "next/server"
import { remove } from "@/lib/schedule-store"
import { requireAdmin } from "@/lib/admin-auth"

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.authorized) return auth.response

  const { id } = await params
  const ok = remove(id)
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not found" }, { status: 404 })
}
