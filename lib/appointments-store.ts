import type { Appointment, AppointmentStatus } from "@/lib/types"

// Module-level singleton — persists across requests within the same server process.
// Works in development and on Vercel (reused Lambda instances keep state warm).
// For guaranteed persistence across cold starts, add Vercel KV:
//   vercel.com/dashboard → Storage → Create KV → link to project → redeploy.

const g = global as typeof global & { _appointments?: Appointment[] }
if (!g._appointments) g._appointments = []

export function getAll(): Appointment[] {
  return g._appointments!
}

export function create(data: Omit<Appointment, "id" | "createdAt" | "status">): Appointment {
  const apt: Appointment = {
    ...data,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString().split("T")[0],
  }
  g._appointments!.push(apt)
  return apt
}

export function updateStatus(id: string, status: AppointmentStatus): Appointment | null {
  const apt = g._appointments!.find((a) => a.id === id)
  if (!apt) return null
  apt.status = status
  return apt
}

export function remove(id: string): boolean {
  const before = g._appointments!.length
  g._appointments = g._appointments!.filter((a) => a.id !== id)
  return g._appointments.length < before
}
