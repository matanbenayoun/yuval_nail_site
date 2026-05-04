import type { BlockedPhone } from "@/lib/types"

const g = global as typeof global & { _blockedPhones?: BlockedPhone[] }
if (!g._blockedPhones) g._blockedPhones = []

export function getAll(): BlockedPhone[] {
  return g._blockedPhones!
}

export function add(phone: string, reason?: string): BlockedPhone {
  const existing = g._blockedPhones!.find((b) => b.phone === phone)
  if (existing) return existing
  const entry: BlockedPhone = { phone, reason, createdAt: new Date().toISOString() }
  g._blockedPhones!.push(entry)
  return entry
}

export function remove(phone: string): boolean {
  const before = g._blockedPhones!.length
  g._blockedPhones = g._blockedPhones!.filter((b) => b.phone !== phone)
  return g._blockedPhones.length < before
}

export function isBlocked(phone: string): boolean {
  const normalized = phone.replace(/[\s\-]/g, "")
  return g._blockedPhones!.some((b) => b.phone.replace(/[\s\-]/g, "") === normalized)
}
