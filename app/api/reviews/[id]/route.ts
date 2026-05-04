import { NextResponse } from "next/server"
import { approve, remove } from "@/lib/reviews-store"
import { requireAdmin } from "@/lib/admin-auth"

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.authorized) return auth.response

  const { id } = await params
  const review = approve(id)
  return review ? NextResponse.json(review) : NextResponse.json({ error: "not found" }, { status: 404 })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.authorized) return auth.response

  const { id } = await params
  const ok = remove(id)
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not found" }, { status: 404 })
}
