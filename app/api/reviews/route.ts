import { NextResponse } from "next/server"
import { getApproved, create } from "@/lib/reviews-store"

export async function GET() {
  return NextResponse.json(getApproved())
}

export async function POST(req: Request) {
  const { name, text, rating } = await req.json()
  if (!name || !text || !rating) return NextResponse.json({ error: "missing fields" }, { status: 400 })
  const review = create({ name, text, rating: Number(rating) })
  return NextResponse.json(review)
}
