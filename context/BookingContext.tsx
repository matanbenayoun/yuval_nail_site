"use client"

import { createContext, useContext, useState } from "react"

export type AppointmentStatus = "pending" | "confirmed" | "cancelled"

export interface Appointment {
  id: string
  name: string
  phone: string
  service: string
  date: string
  time: string
  status: AppointmentStatus
  createdAt: string
}

interface BookingContextType {
  appointments: Appointment[]
  addAppointment: (apt: Omit<Appointment, "id" | "createdAt" | "status">) => void
  updateStatus: (id: string, status: AppointmentStatus) => void
  isTimeBooked: (date: string, time: string) => boolean
}

const BookingContext = createContext<BookingContextType | null>(null)

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "1", name: "שרה כהן", phone: "052-1234567", service: "מניקור ג'ל", date: "2026-04-28", time: "10:00", status: "confirmed", createdAt: "2026-04-20" },
  { id: "2", name: "נועה לוי", phone: "054-9876543", service: "אמנות ציפורניים", date: "2026-04-28", time: "14:00", status: "pending", createdAt: "2026-04-21" },
  { id: "3", name: "תמר בן-דוד", phone: "050-5555555", service: "תוספות ותחזוקה", date: "2026-04-29", time: "12:00", status: "pending", createdAt: "2026-04-22" },
  { id: "4", name: "מיה שפירו", phone: "053-7777777", service: "מניקור ג'ל", date: "2026-04-30", time: "16:00", status: "confirmed", createdAt: "2026-04-23" },
  { id: "5", name: "רותם כץ", phone: "058-1112233", service: "אמנות ציפורניים", date: "2026-05-01", time: "10:00", status: "cancelled", createdAt: "2026-04-23" },
]

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)

  function addAppointment(apt: Omit<Appointment, "id" | "createdAt" | "status">) {
    setAppointments((prev) => [
      ...prev,
      {
        ...apt,
        id: crypto.randomUUID(),
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
      },
    ])
  }

  function updateStatus(id: string, status: AppointmentStatus) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )
  }

  function isTimeBooked(date: string, time: string) {
    return appointments.some(
      (a) => a.date === date && a.time === time && a.status !== "cancelled"
    )
  }

  return (
    <BookingContext.Provider value={{ appointments, addAppointment, updateStatus, isTimeBooked }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider")
  return ctx
}
