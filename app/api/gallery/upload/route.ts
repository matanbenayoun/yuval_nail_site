import { NextResponse } from "next/server"
import { addUpload, removeUpload } from "@/lib/gallery-store"
import { requireAdmin } from "@/lib/admin-auth"

export async function POST(req: Request) {
  const auth = await requireAdmin()
  if (!auth.authorized) return auth.response

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 })

  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString("base64")
  const dataUrl = `data:${file.type};base64,${base64}`

  const img = addUpload(dataUrl)
  return NextResponse.json({ id: img.id })
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin()
  if (!auth.authorized) return auth.response

  const { id } = await req.json()
  const ok = removeUpload(id)
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not found" }, { status: 404 })
}
