interface UploadedImage {
  id: string
  dataUrl: string
  createdAt: string
}

const g = global as typeof global & { _galleryUploads?: UploadedImage[] }
if (!g._galleryUploads) g._galleryUploads = []

export function getUploads(): UploadedImage[] {
  return g._galleryUploads!
}

export function addUpload(dataUrl: string): UploadedImage {
  const img: UploadedImage = { id: crypto.randomUUID(), dataUrl, createdAt: new Date().toISOString() }
  g._galleryUploads!.push(img)
  return img
}

export function removeUpload(id: string): boolean {
  const before = g._galleryUploads!.length
  g._galleryUploads = g._galleryUploads!.filter((u) => u.id !== id)
  return g._galleryUploads.length < before
}
