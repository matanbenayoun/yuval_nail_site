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

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]
const SERVICES = ["מניקור ג'ל", "ציורים בלק ג'ל יד", "תוספות ותחזוקה"]

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
          style={{ background: "oklch(0.89 0.022 65)" }}
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
