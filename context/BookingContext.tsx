"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { Appointment, AppointmentStatus } from "@/lib/types"

export type { Appointment, AppointmentStatus }

interface BookingContextType {
  appointments: Appointment[]
  addAppointment: (apt: Omit<Appointment, "id" | "createdAt" | "status">) => Promise<void>
  updateStatus: (id: string, status: AppointmentStatus) => Promise<void>
  deleteAppointment: (id: string) => Promise<void>
  isTimeBooked: (date: string, time: string) => boolean
}

const BookingContext = createContext<BookingContextType | null>(null)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then(setAppointments)
      .catch(() => {})
  }, [])

  async function addAppointment(data: Omit<Appointment, "id" | "createdAt" | "status">) {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const apt: Appointment = await res.json()
      setAppointments((prev) => [...prev, apt])
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

  function isTimeBooked(date: string, time: string) {
    return appointments.some(
      (a) => a.date === date && a.time === time && a.status !== "cancelled"
    )
  }

  return (
    <BookingContext.Provider value={{ appointments, addAppointment, updateStatus, deleteAppointment, isTimeBooked }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider")
  return ctx
}
