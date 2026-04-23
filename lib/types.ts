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
