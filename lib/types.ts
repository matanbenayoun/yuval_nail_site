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

export interface ScheduleBlock {
  id: string
  date: string
  time?: string  // undefined = entire day blocked
  reason?: string
  createdAt: string
}

export interface BlockedPhone {
  phone: string
  reason?: string
  createdAt: string
}

export interface Review {
  id: string
  name: string
  text: string
  rating: number
  createdAt: string
  approved: boolean
}
