import { NextResponse } from "next/server"
import { getAll, create } from "@/lib/appointments-store"
import { isBlocked } from "@/lib/blocked-phones-store"
import { isTimeBlocked } from "@/lib/schedule-store"

export async function GET() {
  return NextResponse.json(getAll())
}

export async function POST(req: Request) {
  const body = await req.json()

  if (isBlocked(body.phone ?? "")) {
    return NextResponse.json({ error: "מספר זה אינו יכול לקבוע תורים" }, { status: 403 })
  }

  if (isTimeBlocked(body.date, body.time)) {
    return NextResponse.json({ error: "השעה הנבחרת חסומה" }, { status: 409 })
  }

  const apt = create(body)
  return NextResponse.json(apt)
}
