"use client"

import { createContext, useContext, useState } from "react"

export interface GalleryImage {
  id: string
  name: string
  background: string
  isUploaded: boolean
  blobUrl?: string
}

interface GalleryContextType {
  images: GalleryImage[]
  addImage: (file: File) => void
  removeImage: (id: string) => void
}

const GalleryContext = createContext<GalleryContextType | null>(null)

const INITIAL_IMAGES: GalleryImage[] = [
  {
    id: "g1",
    name: "בז' טבעי",
    background: "linear-gradient(160deg, #F5E6D3 0%, #E8C9A0 50%, #D4A574 100%)",
    isUploaded: false,
  },
  {
    id: "g2",
    name: "עלי ורד",
    background: "linear-gradient(160deg, #F5D0D8 0%, #E8A4B8 50%, #D48090 100%)",
    isUploaded: false,
  },
  {
    id: "g3",
    name: "סגול קטיפה",
    background: "linear-gradient(160deg, #C8A4C8 0%, #A870A8 50%, #884888 100%)",
    isUploaded: false,
  },
  {
    id: "g4",
    name: "לבן צרפתי",
    background: "linear-gradient(160deg, #FAFAF2 0%, #F0EDD8 50%, #E0D8B8 100%)",
    isUploaded: false,
  },
  {
    id: "g5",
    name: "טרה קוטה",
    background: "linear-gradient(160deg, #D4895A 0%, #C0683A 50%, #A0481A 100%)",
    isUploaded: false,
  },
  {
    id: "g6",
    name: "שמפניה",
    background: "linear-gradient(160deg, #F0DFA0 0%, #D4C070 50%, #B8A040 100%)",
    isUploaded: false,
  },
]

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<GalleryImage[]>(INITIAL_IMAGES)

  function addImage(file: File) {
    const blobUrl = URL.createObjectURL(file)
    setImages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        background: `url(${blobUrl}) center/cover no-repeat`,
        isUploaded: true,
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
