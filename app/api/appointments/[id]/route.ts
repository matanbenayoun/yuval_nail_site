import { NextResponse } from "next/server"
import { updateStatus, remove } from "@/lib/appointments-store"
import { requireAdmin } from "@/lib/admin-auth"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if (!auth.authorized) return auth.response

  const { id } = await params
  const { status } = await req.json()
  const updated = updateStatus(id, status)
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if (!auth.authorized) return auth.response

  const { id } = await params
  const deleted = remove(id)
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}
