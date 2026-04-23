import { NextResponse } from "next/server"
import { getAll, create } from "@/lib/appointments-store"

export async function GET() {
  return NextResponse.json(getAll())
}

export async function POST(req: Request) {
  const body = await req.json()
  const apt = create(body)
  return NextResponse.json(apt)
}
