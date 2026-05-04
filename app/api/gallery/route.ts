import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { getUploads } from "@/lib/gallery-store"

const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif|bmp)$/i

export async function GET() {
  const dir = path.join(process.cwd(), "public", "gallery")

  let staticImages: { id: string; name: string; url: string; source: "static" }[] = []
  try {
    const files = fs.readdirSync(dir).filter((f) => IMAGE_RE.test(f))
    staticImages = files.map((f) => ({
      id: `static-${f}`,
      name: f.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      url: `/gallery/${f}`,
      source: "static" as const,
    }))
  } catch {
    // gallery dir missing or empty — fine
  }

  const uploads = getUploads().map((u) => ({
    id: u.id,
    name: "",
    url: u.dataUrl,
    source: "upload" as const,
  }))

  return NextResponse.json([...staticImages, ...uploads])
}
