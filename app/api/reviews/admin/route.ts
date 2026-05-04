import { NextResponse } from "next/server"
import { getAll } from "@/lib/reviews-store"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.authorized) return auth.response

  return NextResponse.json(getAll())
}
