"use client"

import { createContext, useContext, useState, useEffect } from "react"

export type ImageSource = "gradient" | "static" | "upload"

export interface GalleryImage {
  id: string
  name: string
  background: string
  source: ImageSource
}

interface GalleryContextType {
  images: GalleryImage[]
  addImage: (file: File) => Promise<void>
  removeImage: (id: string) => Promise<void>
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

function apiToGalleryImage(item: { id: string; name: string; url: string; source: string }): GalleryImage {
  return {
    id: item.id,
    name: item.name,
    background: `url(${item.url}) center/cover no-repeat`,
    source: item.source as ImageSource,
  }
}

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<GalleryImage[]>(GRADIENT_PLACEHOLDERS)

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((items: { id: string; name: string; url: string; source: string }[]) => {
        if (items.length === 0) return
        const loaded = items.map(apiToGalleryImage)
        setImages((prev) => {
          const uploads = prev.filter((i) => i.source === "upload")
          return [...loaded, ...uploads.filter((u) => !loaded.find((l) => l.id === u.id))]
        })
      })
      .catch(() => {})
  }, [])

  async function addImage(file: File) {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/gallery/upload", { method: "POST", body: formData })
    if (!res.ok) return
    const { id } = await res.json()

    // Reload gallery to get the new image included
    const items = await fetch("/api/gallery").then((r) => r.json()).catch(() => [])
    const loaded: GalleryImage[] = items.map(apiToGalleryImage)
    setImages(loaded)
    void id
  }

  async function removeImage(id: string) {
    const img = images.find((i) => i.id === id)
    if (img?.source === "upload") {
      await fetch("/api/gallery/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
    }
    setImages((prev) => prev.filter((i) => i.id !== id))
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
