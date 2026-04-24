"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBooking } from "@/context/BookingContext"
import CancellationPolicyModal from "@/components/CancellationPolicyModal"
import { CheckCircle, Clock, CalendarDays, User, Phone, Sparkles, AlertCircle } from "lucide-react"
import { SITE_CONFIG } from "@/lib/config"

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]
const SERVICES = ["מניקור ג'ל", "ציורים בלק ג'ל יד", "תוספות ותחזוקה"]
const SERVICE_DURATION: Record<string, number> = {
  "מניקור ג'ל": 60,
  "ציורים בלק ג'ל יד": 90,
  "תוספות ותחזוקה": 45,
}

function toDateString(date: Date): string {
  return date.toISOString().split("T")[0]
}

function calendarDates(dateStr: string, timeStr: string, durationMin: number) {
  const [h, m] = timeStr.split(":").map(Number)
  const pad = (n: number) => String(n).padStart(2, "0")
  const base = dateStr.replace(/-/g, "")
  const startTime = `${pad(h)}${pad(m)}00`
  const endH = Math.floor((h * 60 + m + durationMin) / 60)
  const endM = (h * 60 + m + durationMin) % 60
  const endTime = `${pad(endH)}${pad(endM)}00`
  return { start: `${base}T${startTime}`, end: `${base}T${endTime}` }
}

function googleCalendarUrl(service: string, dateStr: string, timeStr: string) {
  const dur = SERVICE_DURATION[service] ?? 60
  const { start, end } = calendarDates(dateStr, timeStr, dur)
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `תור אצל יובל סין ראובן — ${service}`,
    dates: `${start}/${end}`,
    details: `שירות: ${service}`,
    location: SITE_CONFIG.address,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

function appleCalendarIcs(service: string, dateStr: string, timeStr: string) {
  const dur = SERVICE_DURATION[service] ?? 60
  const { start, end } = calendarDates(dateStr, timeStr, dur)
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//yuval-nails//booking//HE",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:תור אצל יובל סין ראובן — ${service}`,
    `DESCRIPTION:שירות: ${service}`,
    `LOCATION:${SITE_CONFIG.address.replace(/,/g, "\\,")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
  return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`
}

export default function BookingForm() {
  const { addAppointment, isTimeBooked } = useBooking()
  const router = useRouter()

  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState<string>("")
  const [service, setService] = useState<string>("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [policyAccepted, setPolicyAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const dateStr = date ? toDateString(date) : ""

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!service) { setError("נא לבחור שירות."); return }
    if (!name.trim() || name.trim().length < 2) { setError("נא להזין שם מלא (לפחות 2 תווים)."); return }
    if (!phone.trim() || phone.trim().length < 9) { setError("נא להזין מספר טלפון תקין."); return }
    if (!policyAccepted) { setError("יש לאשר את מדיניות הביטולים כדי להמשיך."); return }
    await addAppointment({ name: name.trim(), phone: phone.trim(), service, date: dateStr, time })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-6 py-12 px-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "oklch(0.90 0.03 222)" }}
        >
          <CheckCircle size={28} style={{ color: "oklch(0.55 0.18 222)" }} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">הזמנתך אושרה! 💅</h2>
          <p className="text-muted-foreground text-sm">
            {service} · {date?.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })} · {time}
          </p>
          <p className="text-muted-foreground text-sm mt-1">נשמח לראותך בקרוב, {name}!</p>
        </div>

        {/* Add to calendar */}
        <div className="w-full space-y-2">
          <p className="text-xs text-muted-foreground text-center">הוסיפי לו להזמנה ליומן שלך</p>
          <div className="flex gap-2">
            <a
              href={googleCalendarUrl(service, dateStr, time)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-full border border-border/60 text-xs font-medium hover:bg-accent transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 2v2M18 2v2M2 8h20M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="#4285F4" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 13h2v2H8zM11 13h2v2h-2zM14 13h2v2h-2zM8 16h2v2H8zM11 16h2v2h-2z" fill="#EA4335"/>
              </svg>
              Google Calendar
            </a>
            <a
              href={appleCalendarIcs(service, dateStr, time)}
              download="tor-yuval.ics"
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-full border border-border/60 text-xs font-medium hover:bg-accent transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple Calendar
            </a>
          </div>
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
              setPolicyAccepted(false)
            }}
          >
            הזמנה נוספת
          </Button>
          <Button className="flex-1 rounded-full text-sm" onClick={() => router.push("/")}>
            לדף הבית
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Date */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CalendarDays size={16} style={{ color: "oklch(0.55 0.18 222)" }} />
          <span>בחרי תאריך</span>
        </div>
        <div className="flex justify-center" dir="ltr">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => { setDate(d); setTime("") }}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0)) || d.getDay() === 6}
            className="rounded-xl border border-border/60"
          />
        </div>
      </div>

      {/* Step 2: Time */}
      {date && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock size={16} style={{ color: "oklch(0.55 0.18 222)" }} />
            <span>בחרי שעה</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => {
              const booked = isTimeBooked(dateStr, slot)
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={booked}
                  onClick={() => setTime(slot)}
                  className={`py-3 px-2 rounded-xl border transition-all duration-200 min-h-[52px] ${
                    booked
                      ? "opacity-40 cursor-not-allowed border-border/40 line-through text-muted-foreground"
                      : time === slot
                      ? "border-transparent text-primary-foreground"
                      : "border-border/60 hover:border-primary/40 hover:bg-accent"
                  }`}
                  style={time === slot && !booked ? { background: "oklch(0.55 0.18 222)" } : {}}
                >
                  <span className="text-xs font-semibold">{slot}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {time && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles size={16} style={{ color: "oklch(0.55 0.18 222)" }} />
            <span>הפרטים שלך</span>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              שירות <span className="text-destructive">*</span>
            </Label>
            <Select value={service} onValueChange={(val) => val && setService(val)} required>
              <SelectTrigger
                className={`rounded-xl h-12 ${!service ? "border-border/60" : "border-border/60"}`}
                aria-required="true"
              >
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
            <Label htmlFor="name" className="text-xs text-muted-foreground flex items-center gap-1">
              <User size={11} />שם מלא <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="שמך המלא"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-border/60 h-12"
              required
              aria-required="true"
              minLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone size={11} />טלפון <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="05x-xxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border-border/60 h-12"
              dir="ltr"
              required
              aria-required="true"
              pattern="[0-9\-\+\s]{9,15}"
            />
          </div>

          {/* Cancellation policy checkbox */}
          <div
            className="flex gap-3 items-start p-4 rounded-2xl border border-border/60"
            style={{ background: "oklch(0.96 0.01 222)" }}
          >
            <button
              type="button"
              onClick={() => setPolicyAccepted(!policyAccepted)}
              className={`mt-0.5 w-5 h-5 min-w-5 rounded border-2 transition-all flex items-center justify-center shrink-0 ${
                policyAccepted
                  ? "border-transparent"
                  : "border-border bg-white"
              }`}
              style={policyAccepted ? { background: "oklch(0.55 0.18 222)" } : {}}
              aria-label="אשרי מדיניות ביטולים"
            >
              {policyAccepted && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <p className="text-sm leading-relaxed text-muted-foreground">
              קראתי ואני מסכימה{" "}
              <CancellationPolicyModal />
              {" "}של הסטודיו.
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 rounded-xl px-4 py-3">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      {time && (
        <Button type="submit" size="lg" className="w-full rounded-full text-sm h-13">
          אישור הזמנה
        </Button>
      )}
    </form>
  )
}
