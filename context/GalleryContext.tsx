"use client"

import { createContext, useContext, useState, useEffect } from "react"

export type ImageSource = "gradient" | "static" | "upload"

export interface GalleryImage {
  id: string
  name: string
  background: string
  source: ImageSource
  blobUrl?: string
}

interface GalleryContextType {
  images: GalleryImage[]
  addImage: (file: File) => void
  removeImage: (id: string) => void
}

const GalleryContext = createContext<GalleryContextType | null>(null)

const GRADIENT_PLACEHOLDERS: GalleryImage[] = [
  { id: "g1", name: "בז' טבעי",     background: "linear-gradient(160deg, #F5E6D3 0%, #E8C9A0 50%, #D4A574 100%)", source: "gradient" },
  { id: "g2", name: "עלי ורד",       background: "linear-gradient(160deg, #F5D0D8 0%, #E8A4B8 50%, #D48090 100%)", source: "gradient" },
  { id: "g3", name: "סגול קטיפה",    background: "linear-gradient(160deg, #C8A4C8 0%, #A870A8 50%, #884888 100%)", source: "gradient" },
  { id: "g4", name: "לבן צרפתי",     background: "linear-gradient(160deg, #FAFAF2 0%, #F0EDD8 50%, #E0D8B8 100%)", source: "gradient" },
  { id: "g5", name: "טרה קוטה",      background: "linear-gradient(160deg, #D4895A 0%, #C0683A 50%, #A0481A 100%)", source: "gradient" },
  { id: "g6", name: "שמפניה",        background: "linear-gradient(160deg, #F0DFA0 0%, #D4C070 50%, #B8A040 100%)", source: "gradient" },
]

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<GalleryImage[]>(GRADIENT_PLACEHOLDERS)

  // Load images from public/gallery/ on mount
  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((files: { name: string; url: string }[]) => {
        if (files.length === 0) return
        const staticImgs: GalleryImage[] = files.map((f, i) => ({
          id: `static-${i}-${f.url}`,
          name: f.name,
          background: `url(${f.url}) center/cover no-repeat`,
          source: "static" as const,
        }))
        setImages((prev) => {
          // Keep uploads, replace gradient placeholders with real images
          const uploads = prev.filter((i) => i.source === "upload")
          return [...staticImgs, ...uploads]
        })
      })
      .catch(() => {})
  }, [])

  function addImage(file: File) {
    const blobUrl = URL.createObjectURL(file)
    setImages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        background: `url(${blobUrl}) center/cover no-repeat`,
        source: "upload" as const,
        blobUrl,
      },
    ])
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id)
      if (img?.blobUrl) URL.revokeObjectURL(img.blobUrl)
      return prev.filter((i) => i.id !== id)
    })
  }

  return (
    <GalleryContext.Provider value={{ images, addImage, removeImage }}>
      {children}
    </GalleryContext.Provider>
  )
}

export function useGallery() {
  const ctx = useContext(GalleryContext)
  if (!ctx) throw new Error("useGallery must be used inside GalleryProvider")
  return ctx
}
