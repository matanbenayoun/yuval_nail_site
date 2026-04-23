"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBooking } from "@/context/BookingContext"
import { CheckCircle, Clock, CalendarDays, User, Phone, Sparkles } from "lucide-react"

const TIME_SLOTS = ["10:00", "12:00", "14:00", "16:00"]
const SERVICES = ["מניקור ג'ל", "תוספות ותחזוקה", "אמנות ציפורניים"]

function toDateString(date: Date): string {
  return date.toISOString().split("T")[0]
}

export default function BookingForm() {
  const { addAppointment, isTimeBooked } = useBooking()
  const router = useRouter()

  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState<string>("")
  const [service, setService] = useState<string>("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const dateStr = date ? toDateString(date) : ""

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !time || !service || !name || !phone) {
      setError("נא למלא את כל הפרטים.")
      return
    }
    addAppointment({ name, phone, service, date: dateStr, time })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-6 py-12 px-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "oklch(0.89 0.022 65)" }}
        >
          <CheckCircle size={28} style={{ color: "oklch(0.61 0.072 62)" }} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">הזמנתך אושרה! 💅</h2>
          <p className="text-muted-foreground text-sm">
            {service} · {date?.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })} · {time}
          </p>
          <p className="text-muted-foreground text-sm mt-1">נשמח לראותך בקרוב, {name}!</p>
        </div>
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1 rounded-full text-sm"
            onClick={() => {
              setSubmitted(false)
              setDate(undefined)
              setTime("")
              setService("")
              setName("")
              setPhone("")
            }}
          >
            הזמנה נוספת
          </Button>
          <Button
            className="flex-1 rounded-full text-sm"
            onClick={() => router.push("/")}
          >
            לדף הבית
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CalendarDays size={16} style={{ color: "oklch(0.61 0.072 62)" }} />
          <span>בחרי תאריך</span>
        </div>
        {/* Calendar is LTR to preserve month/day layout */}
        <div className="flex justify-center" dir="ltr">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => { setDate(d); setTime("") }}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0)) || d.getDay() === 0}
            className="rounded-xl border border-border/60"
          />
        </div>
      </div>

      {/* Step 2 */}
      {date && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock size={16} style={{ color: "oklch(0.61 0.072 62)" }} />
            <span>בחרי שעה</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {TIME_SLOTS.map((slot) => {
              const booked = isTimeBooked(dateStr, slot)
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={booked}
                  onClick={() => setTime(slot)}
                  className={`py-4 px-4 rounded-xl text-sm font-medium border transition-all duration-200 min-h-[56px] ${
                    booked
                      ? "opacity-40 cursor-not-allowed border-border/40 line-through text-muted-foreground"
                      : time === slot
                      ? "border-transparent text-primary-foreground"
                      : "border-border/60 hover:border-primary/40 hover:bg-accent"
                  }`}
                  style={time === slot && !booked ? { background: "oklch(0.61 0.072 62)" } : {}}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {time && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles size={16} style={{ color: "oklch(0.61 0.072 62)" }} />
            <span>הפרטים שלך</span>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">שירות</Label>
            <Select value={service} onValueChange={(val) => val && setService(val)}>
              <SelectTrigger className="rounded-xl border-border/60 h-12">
                <SelectValue placeholder="בחרי שירות..." />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs text-muted-foreground">
              <User size={11} className="inline ms-1" />שם מלא
            </Label>
            <Input
              id="name"
              placeholder="שמך"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-border/60 h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs text-muted-foreground">
              <Phone size={11} className="inline ms-1" />טלפון
            </Label>
            <Input
              id="phone"
              placeholder="05x-xxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border-border/60 h-12"
              dir="ltr"
            />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {time && (
        <Button type="submit" size="lg" className="w-full rounded-full text-sm h-13">
          אישור הזמנה
        </Button>
      )}
    </form>
  )
}
