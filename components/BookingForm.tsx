"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBooking, SERVICE_DURATIONS } from "@/context/BookingContext"
import CancellationPolicyModal from "@/components/CancellationPolicyModal"
import { CheckCircle, Clock, CalendarDays, User, Phone, Sparkles, AlertCircle, MessageCircle } from "lucide-react"
import { SITE_CONFIG, whatsappHref } from "@/lib/config"

const SERVICES = ["לק ג'ל", "בנייה בג'ל", "ציור פשוט", "ציור מורכב"]
const DRAWING_SERVICES = new Set(["ציור פשוט", "ציור מורכב"])

// Per-day time slot rules
const ALL_TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

function getSlotsForDay(dayOfWeek: number, durationMin: number): string[] {
  // Friday = closed, Saturday = closed (handled at calendar level)
  let base = ALL_TIME_SLOTS
  if (dayOfWeek === 4) {
    // Thursday — must finish by 15:00
    base = ALL_TIME_SLOTS.filter((t) => timeToMinutes(t) + durationMin <= 15 * 60)
  }
  // Remove slots where appointment would end after 19:00
  return base.filter((t) => timeToMinutes(t) + durationMin <= 19 * 60)
}

function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
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
  const dur = SERVICE_DURATIONS[service] ?? 90
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
  const dur = SERVICE_DURATIONS[service] ?? 90
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

function StepIndicator({ step }: { step: 1 | 2 | 3 | 4 }) {
  const steps: { n: 1 | 2 | 3 | 4; label: string }[] = [
    { n: 1, label: "שירות" },
    { n: 2, label: "תאריך" },
    { n: 3, label: "שעה" },
    { n: 4, label: "פרטים" },
  ]
  return (
    <div className="flex items-start justify-center">
      {steps.map(({ n, label }, i) => {
        const done = step > n
        const active = step === n
        return (
          <div key={n} className="flex items-start">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  done || active ? "text-white" : "border-2 border-border text-muted-foreground"
                }`}
                style={done || active ? { background: "oklch(0.55 0.18 222)" } : {}}
              >
                {done ? (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : n}
              </div>
              <span className={`text-[10px] ${active ? "font-medium" : "text-muted-foreground"}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-10 sm:w-14 h-0.5 mx-1.5 mt-4 transition-all duration-500"
                style={{ background: step > n ? "oklch(0.55 0.18 222)" : "oklch(0.88 0.018 222)" }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function BookingForm() {
  const { addAppointment, isSlotAvailable, isDateFullyBlocked } = useBooking()
  const router = useRouter()

  const [service, setService] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState<string>("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [policyAccepted, setPolicyAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const dateStr = date ? toDateString(date) : ""
  const duration = service ? (SERVICE_DURATIONS[service] ?? 90) : 90
  const isDrawing = DRAWING_SERVICES.has(service)

  const currentStep: 1 | 2 | 3 | 4 = !service ? 1 : !date ? 2 : !time ? 3 : 4

  const timeSlots = date
    ? getSlotsForDay(date.getDay(), duration)
    : []

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!name.trim() || name.trim().length < 2) { setError("נא להזין שם מלא (לפחות 2 תווים)."); return }
    if (!phone.trim() || phone.trim().length < 9) { setError("נא להזין מספר טלפון תקין."); return }
    if (!policyAccepted) { setError("יש לאשר את מדיניות הביטולים כדי להמשיך."); return }

    const result = await addAppointment({ name: name.trim(), phone: phone.trim(), service, date: dateStr, time })
    if (result.ok) {
      setSubmitted(true)
    } else {
      setError(result.error ?? "שגיאה בהזמנה, נסי שוב.")
    }
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
              setService("")
              setDate(undefined)
              setTime("")
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
      <StepIndicator step={currentStep} />

      {/* Step 1: Service */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles size={16} style={{ color: "oklch(0.55 0.18 222)" }} />
          <span>בחרי שירות</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SERVICES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setService(s); setDate(undefined); setTime("") }}
              className={`py-3 px-4 rounded-xl border text-sm font-medium text-start transition-all duration-200 ${
                service === s
                  ? "border-transparent text-primary-foreground"
                  : "border-border/60 hover:border-primary/40 hover:bg-accent"
              }`}
              style={service === s ? { background: "oklch(0.55 0.18 222)" } : {}}
            >
              <span className="flex items-center justify-between">
                {s}
                <span className={`text-xs font-normal ${service === s ? "text-white/70" : "text-muted-foreground"}`}>
                  {SERVICE_DURATIONS[s] === 90 ? "שעה וחצי" : SERVICE_DURATIONS[s] === 120 ? "שעתיים" : "3 שעות"}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* WhatsApp notice for drawing services */}
      {isDrawing && (
        <div
          className="flex gap-3 items-start p-4 rounded-2xl border"
          style={{ background: "oklch(0.97 0.012 135)", borderColor: "oklch(0.75 0.1 135)" }}
        >
          <MessageCircle size={18} className="shrink-0 mt-0.5" style={{ color: "oklch(0.45 0.12 135)" }} />
          <div className="space-y-1.5">
            <p className="text-sm font-medium" style={{ color: "oklch(0.35 0.1 135)" }}>
              נדרש תיאום מראש בוואטסאפ
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "oklch(0.45 0.08 135)" }}>
              שירות הציורים דורש תיאום העיצוב עם יובל לפני קביעת התור.
              אנא צרי קשר בוואטסאפ ותאמי את העיצוב, ורק לאחר מכן קבעי תור.
            </p>
            <a
              href={whatsappHref(`שלום יובל! אני מעוניינת לתאם ${service} 💅`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full mt-1"
              style={{ background: "oklch(0.55 0.15 135)", color: "white" }}
            >
              <MessageCircle size={11} />
              פתחי וואטסאפ עם יובל
            </a>
          </div>
        </div>
      )}

      {/* Step 2: Date */}
      {service && (
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
              disabled={(d) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                if (d < today) return true
                if (d.getDay() === 5 || d.getDay() === 6) return true // Friday + Saturday
                if (isDateFullyBlocked(toDateString(d))) return true
                return false
              }}
              className="rounded-xl border border-border/60"
            />
          </div>
        </div>
      )}

      {/* Step 3: Time */}
      {date && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock size={16} style={{ color: "oklch(0.55 0.18 222)" }} />
            <span>בחרי שעה</span>
            {date.getDay() === 4 && (
              <span className="text-xs text-muted-foreground">(יום ה׳ — עד 15:00)</span>
            )}
          </div>
          {timeSlots.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground py-4">
              אין שעות פנויות ביום זה לשירות הנבחר. בחרי תאריך אחר.
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {timeSlots.map((slot) => {
                const available = isSlotAvailable(dateStr, slot, duration)
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={!available}
                    onClick={() => setTime(slot)}
                    className={`py-3 px-2 rounded-xl border transition-all duration-200 min-h-[52px] ${
                      !available
                        ? "opacity-40 cursor-not-allowed border-border/40 line-through text-muted-foreground"
                        : time === slot
                        ? "border-transparent text-primary-foreground"
                        : "border-border/60 hover:border-primary/40 hover:bg-accent"
                    }`}
                    style={time === slot && available ? { background: "oklch(0.55 0.18 222)" } : {}}
                  >
                    <span className="text-xs font-semibold">{slot}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Details */}
      {time && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <User size={16} style={{ color: "oklch(0.55 0.18 222)" }} />
            <span>הפרטים שלך</span>
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
              pattern="[0-9\-\+\s]{9,15}"
            />
          </div>

          {/* Cancellation policy */}
          <div
            className="flex gap-3 items-start p-4 rounded-2xl border border-border/60"
            style={{ background: "oklch(0.96 0.01 222)" }}
          >
            <button
              type="button"
              onClick={() => setPolicyAccepted(!policyAccepted)}
              className={`mt-0.5 w-5 h-5 min-w-5 rounded border-2 transition-all flex items-center justify-center shrink-0 ${
                policyAccepted ? "border-transparent" : "border-border bg-white"
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
