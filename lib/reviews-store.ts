import type { Review } from "@/lib/types"

const g = global as typeof global & { _reviews?: Review[] }
if (!g._reviews) g._reviews = []

export function getAll(): Review[] {
  return g._reviews!
}

export function getApproved(): Review[] {
  return g._reviews!.filter((r) => r.approved)
}

export function create(data: Pick<Review, "name" | "text" | "rating">): Review {
  const review: Review = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    approved: false,
  }
  g._reviews!.push(review)
  return review
}

export function approve(id: string): Review | null {
  const review = g._reviews!.find((r) => r.id === id)
  if (!review) return null
  review.approved = true
  return review
}

export function remove(id: string): boolean {
  const before = g._reviews!.length
  g._reviews = g._reviews!.filter((r) => r.id !== id)
  return g._reviews.length < before
}
