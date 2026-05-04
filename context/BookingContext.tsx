"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { Appointment, AppointmentStatus, ScheduleBlock } from "@/lib/types"

export type { Appointment, AppointmentStatus }

// Service durations in minutes
export const SERVICE_DURATIONS: Record<string, number> = {
  "לק ג'ל": 90,
  "בנייה בג'ל": 120,
  "ציור פשוט": 120,
  "ציור מורכב": 180,
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

function intervalsOverlap(startA: number, endA: number, startB: number, endB: number): boolean {
  return startA < endB && endA > startB
}

interface BookingContextType {
  appointments: Appointment[]
  scheduleBlocks: ScheduleBlock[]
  addAppointment: (apt: Omit<Appointment, "id" | "createdAt" | "status">) => Promise<{ ok: boolean; error?: string }>
  updateStatus: (id: string, status: AppointmentStatus) => Promise<void>
  deleteAppointment: (id: string) => Promise<void>
  isSlotAvailable: (date: string, time: string, durationMin: number) => boolean
  isDateFullyBlocked: (date: string) => boolean
  refreshScheduleBlocks: () => Promise<void>
}

const BookingContext = createContext<BookingContextType | null>(null)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([])

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then(setAppointments)
      .catch(() => {})

    fetch("/api/schedule")
      .then((r) => r.json())
      .then(setScheduleBlocks)
      .catch(() => {})
  }, [])

  async function refreshScheduleBlocks() {
    const blocks = await fetch("/api/schedule").then((r) => r.json()).catch(() => [])
    setScheduleBlocks(blocks)
  }

  async function addAppointment(data: Omit<Appointment, "id" | "createdAt" | "status">): Promise<{ ok: boolean; error?: string }> {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const apt: Appointment = await res.json()
      setAppointments((prev) => [...prev, apt])
      return { ok: true }
    }
    try {
      const body = await res.json()
      return { ok: false, error: body.error }
    } catch {
      return { ok: false, error: "שגיאת שרת" }
    }
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    }
  }

  async function deleteAppointment(id: string) {
    const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" })
    if (res.ok) {
      setAppointments((prev) => prev.filter((a) => a.id !== id))
    }
  }

  function isSlotAvailable(date: string, time: string, durationMin: number): boolean {
    const slotStart = timeToMinutes(time)
    const slotEnd = slotStart + durationMin

    // Check schedule blocks (entire day or specific time)
    const dayBlocked = scheduleBlocks.some((b) => b.date === date && !b.time)
    if (dayBlocked) return false

    const timeBlocked = scheduleBlocks.some((b) => b.date === date && b.time === time)
    if (timeBlocked) return false

    // Check overlap with existing appointments
    return !appointments.some((a) => {
      if (a.date !== date || a.status === "cancelled") return false
      const aptStart = timeToMinutes(a.time)
      const aptDuration = SERVICE_DURATIONS[a.service] ?? 60
      const aptEnd = aptStart + aptDuration
      return intervalsOverlap(slotStart, slotEnd, aptStart, aptEnd)
    })
  }

  function isDateFullyBlocked(date: string): boolean {
    return scheduleBlocks.some((b) => b.date === date && !b.time)
  }

  return (
    <BookingContext.Provider value={{
      appointments,
      scheduleBlocks,
      addAppointment,
      updateStatus,
      deleteAppointment,
      isSlotAvailable,
      isDateFullyBlocked,
      refreshScheduleBlocks,
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider")
  return ctx
}
