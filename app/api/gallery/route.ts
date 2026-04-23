import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif|bmp)$/i

export async function GET() {
  const dir = path.join(process.cwd(), "public", "gallery")
  try {
    const files = fs.readdirSync(dir).filter((f) => IMAGE_RE.test(f))
    const images = files.map((f) => ({
      name: f.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      url: `/gallery/${f}`,
    }))
    return NextResponse.json(images)
  } catch {
    return NextResponse.json([])
  }
}
