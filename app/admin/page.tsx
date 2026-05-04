"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useBooking, type AppointmentStatus } from "@/context/BookingContext"
import { useGallery } from "@/context/GalleryContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ScheduleBlock, BlockedPhone, Review } from "@/lib/types"
import {
  CalendarDays, Clock, User, Phone, Search, LogOut, Trash2, ImagePlus, Home,
  CheckCircle2, XCircle, Timer, Ban, Star, CalendarOff, Plus
} from "lucide-react"

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; next: AppointmentStatus; className: string }> = {
  pending:   { label: "ממתין",  next: "confirmed",  className: "bg-amber-50  text-amber-700  border-amber-200"  },
  confirmed: { label: "אושר",   next: "cancelled",  className: "bg-green-50  text-green-700  border-green-200"  },
  cancelled: { label: "בוטל",   next: "pending",    className: "bg-red-50    text-red-500    border-red-200"    },
}

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("he-IL", { weekday: "short", day: "numeric", month: "short" })
}

type Tab = "appointments" | "gallery" | "schedule" | "blocked" | "reviews"

export default function AdminPage() {
  const { appointments, updateStatus, deleteAppointment, scheduleBlocks, refreshScheduleBlocks } = useBooking()
  const { images, addImage, removeImage } = useGallery()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [tab, setTab] = useState<Tab>("appointments")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all")

  // Schedule state
  const [blockDate, setBlockDate] = useState("")
  const [blockTime, setBlockTime] = useState("")
  const [blockReason, setBlockReason] = useState("")
  const [blockLoading, setBlockLoading] = useState(false)

  // Blocked phones state
  const [blockedPhones, setBlockedPhones] = useState<BlockedPhone[]>([])
  const [newPhone, setNewPhone] = useState("")
  const [newPhoneReason, setNewPhoneReason] = useState("")
  const [phoneLoading, setPhoneLoading] = useState(false)

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetch("/api/blocked-phones").then((r) => r.json()).then(setBlockedPhones).catch(() => {})
    // Admin sees all reviews (including pending)
    fetch("/api/reviews/admin").then((r) => r.json()).then(setReviews).catch(() => {})
  }, [])

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    for (const file of files) await addImage(file)
    e.target.value = ""
  }

  // ── Schedule actions ────────────────────────────────────────────────────────
  async function addBlock() {
    if (!blockDate) return
    setBlockLoading(true)
    await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: blockDate, time: blockTime || undefined, reason: blockReason || undefined }),
    })
    await refreshScheduleBlocks()
    setBlockDate("")
    setBlockTime("")
    setBlockReason("")
    setBlockLoading(false)
  }

  async function removeBlock(id: string) {
    await fetch(`/api/schedule/${id}`, { method: "DELETE" })
    await refreshScheduleBlocks()
  }

  // ── Blocked phones actions ─────────────────────────────────────────────────
  async function blockPhone() {
    if (!newPhone.trim()) return
    setPhoneLoading(true)
    const res = await fetch("/api/blocked-phones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: newPhone.trim(), reason: newPhoneReason || undefined }),
    })
    if (res.ok) {
      const entry = await res.json()
      setBlockedPhones((prev) => [...prev, entry])
    }
    setNewPhone("")
    setNewPhoneReason("")
    setPhoneLoading(false)
  }

  async function unblockPhone(phone: string) {
    await fetch(`/api/blocked-phones/${encodeURIComponent(phone)}`, { method: "DELETE" })
    setBlockedPhones((prev) => prev.filter((b) => b.phone !== phone))
  }

  // ── Review actions ─────────────────────────────────────────────────────────
  async function approveReview(id: string) {
    const res = await fetch(`/api/reviews/${id}`, { method: "PATCH" })
    if (res.ok) {
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, approved: true } : r))
    }
  }

  async function deleteReview(id: string) {
    await fetch(`/api/reviews/${id}`, { method: "DELETE" })
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  // ── Filtered appointments ──────────────────────────────────────────────────
  const filtered = appointments
    .filter((a) => {
      const matchSearch =
        a.name.includes(search) || a.service.includes(search) ||
        a.date.includes(search) || a.phone.includes(search)
      const matchStatus = statusFilter === "all" || a.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

  const todayStr = new Date().toISOString().split("T")[0]
  const stats = {
    total: appointments.length,
    today: appointments.filter((a) => a.date === todayStr).length,
    pending: appointments.filter((a) => a.status === "pending").length,
  }

  const TAB_LABELS: Record<Tab, string> = {
    appointments: "📅 תורים",
    gallery: "🖼️ גלריה",
    schedule: "🗓️ לוח זמנים",
    blocked: "🚫 חסומים",
    reviews: "⭐ ביקורות",
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: "oklch(0.97 0.008 222)" }}>

      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-border/60">
        <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
          <div>
            <p className="text-base font-semibold leading-none">לוח בקרה</p>
            <p className="text-xs text-muted-foreground mt-0.5">יובל סין ראובן</p>
          </div>
          <div className="flex items-center gap-2">
            <Button render={<Link href="/" />} variant="ghost" size="icon" className="rounded-full" aria-label="חזרה לאתר">
              <Home size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" onClick={handleLogout} aria-label="יציאה">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "סה\"כ", value: stats.total, icon: CalendarDays, color: "oklch(0.55 0.18 222)" },
            { label: "היום",  value: stats.today,  icon: Clock,         color: "oklch(0.55 0.15 145)" },
            { label: "ממתינים", value: stats.pending, icon: Timer,      color: "oklch(0.65 0.14 65)"  },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-border/60 p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <Icon size={13} style={{ color }} />
              </div>
              <span className="text-3xl font-semibold leading-none" style={{ color }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Tabs — scrollable row */}
        <div className="flex bg-white rounded-2xl border border-border/60 p-1 gap-1 overflow-x-auto">
          {(["appointments", "gallery", "schedule", "blocked", "reviews"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-none py-2 px-3 rounded-xl text-xs font-medium transition-all min-h-[40px] whitespace-nowrap ${
                tab === t ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              style={tab === t ? { background: "oklch(0.55 0.18 222)" } : {}}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* ══ APPOINTMENTS ══════════════════════════════════════════════════════ */}
        {tab === "appointments" && (
          <div className="space-y-4">
            <div className="relative">
              <Search size={15} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="חיפוש לפי שם, שירות, טלפון..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pe-10 rounded-xl border-border/60 h-12 bg-white"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`flex-none px-4 py-2 rounded-full text-xs font-medium border transition-all min-h-[36px] whitespace-nowrap ${
                    statusFilter === s ? "text-primary-foreground border-transparent" : "bg-white border-border/60 text-muted-foreground hover:border-border"
                  }`}
                  style={statusFilter === s ? { background: "oklch(0.55 0.18 222)" } : {}}
                >
                  {s === "all" ? "הכל" : STATUS_CONFIG[s].label}
                  {s !== "all" && (
                    <span className="ms-1 opacity-70">({appointments.filter((a) => a.status === s).length})</span>
                  )}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">לא נמצאו תורים</div>
            ) : (
              <div className="space-y-3">
                {filtered.map((apt) => {
                  const statusCfg = STATUS_CONFIG[apt.status]
                  return (
                    <div key={apt.id} className="bg-white rounded-2xl border border-border/60 p-4 flex gap-4">
                      <div
                        className="flex flex-col items-center justify-center rounded-xl px-3 py-2 min-w-[58px] shrink-0"
                        style={{ background: "oklch(0.90 0.03 222)" }}
                      >
                        <span className="text-xl font-semibold leading-none" style={{ color: "oklch(0.45 0.15 222)" }}>
                          {new Date(apt.date + "T12:00:00").getDate()}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(apt.date + "T12:00:00").toLocaleString("he-IL", { month: "short" })}
                        </span>
                        <span className="text-xs font-medium mt-1" style={{ color: "oklch(0.45 0.15 222)" }}>
                          {apt.time}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <User size={12} className="text-muted-foreground shrink-0" />
                            <span className="text-sm font-medium truncate">{apt.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button onClick={() => updateStatus(apt.id, statusCfg.next)} title="לחצי לשינוי סטטוס">
                              <Badge variant="outline" className={`text-[10px] cursor-pointer hover:opacity-80 transition-opacity ${statusCfg.className}`}>
                                {statusCfg.label}
                              </Badge>
                            </button>
                            <button
                              onClick={() => { if (confirm(`למחוק את התור של ${apt.name}?`)) deleteAppointment(apt.id) }}
                              className="w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                              title="מחיקת תור"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-muted-foreground" />
                          <a href={`tel:${apt.phone}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors" dir="ltr">
                            {apt.phone}
                          </a>
                        </div>
                        <p className="text-xs text-muted-foreground">{apt.service}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ GALLERY ═══════════════════════════════════════════════════════════ */}
        {tab === "gallery" && (
          <div className="space-y-4">
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full rounded-2xl h-14 border-dashed border-2 text-sm gap-2 border-primary/30 hover:border-primary/60 hover:bg-accent"
            >
              <ImagePlus size={18} style={{ color: "oklch(0.55 0.18 222)" }} />
              העלאת תמונה
            </Button>

            {images.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground text-sm">אין תמונות בגלריה עדיין</p>
            ) : (
              <>
                {images.some((i) => i.source === "static" || i.source === "gradient") && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: "oklch(0.55 0.18 222)" }} />
                      מהתיקייה (public/gallery)
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {images.filter((i) => i.source === "static" || i.source === "gradient").map((img) => (
                        <div key={img.id} className="relative rounded-2xl overflow-hidden aspect-square">
                          <div className="absolute inset-0" style={{ background: img.background }} />
                          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />
                          {img.name && (
                            <div className="absolute bottom-0 start-0 end-0 px-3 py-2 bg-gradient-to-t from-black/40 to-transparent">
                              <p className="text-xs text-white font-medium truncate">{img.name}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {images.some((i) => i.source === "upload") && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block bg-green-500" />
                      הועלו מהאדמין
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {images.filter((i) => i.source === "upload").map((img) => (
                        <div key={img.id} className="relative rounded-2xl overflow-hidden aspect-square">
                          <div className="absolute inset-0" style={{ background: img.background }} />
                          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />
                          <button
                            onClick={() => removeImage(img.id)}
                            className="absolute top-2 end-2 w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                            aria-label="מחקי תמונה"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ══ SCHEDULE ══════════════════════════════════════════════════════════ */}
        {tab === "schedule" && (
          <div className="space-y-5">
            {/* Permanent rules */}
            <div className="bg-white rounded-2xl border border-border/60 p-4 space-y-2">
              <p className="text-sm font-semibold">כללים קבועים</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarOff size={14} style={{ color: "oklch(0.55 0.18 222)" }} />
                יום שישי — סגור (ללא תורים)
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} style={{ color: "oklch(0.55 0.18 222)" }} />
                יום חמישי — עד 15:00 בלבד
              </div>
            </div>

            {/* Add block form */}
            <div className="bg-white rounded-2xl border border-border/60 p-4 space-y-3">
              <p className="text-sm font-semibold">הוספת חסימה</p>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">תאריך *</Label>
                <Input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="rounded-xl border-border/60 h-11"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">שעה ספציפית (ריק = כל היום)</Label>
                <Input
                  type="time"
                  value={blockTime}
                  onChange={(e) => setBlockTime(e.target.value)}
                  className="rounded-xl border-border/60 h-11"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">סיבה (אופציונלי)</Label>
                <Input
                  placeholder="למשל: חופשה, מחלה..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="rounded-xl border-border/60 h-11"
                />
              </div>
              <Button
                onClick={addBlock}
                disabled={!blockDate || blockLoading}
                className="w-full rounded-full text-sm h-11 gap-2"
              >
                <Plus size={14} />
                הוסיפי חסימה
              </Button>
            </div>

            {/* Existing blocks */}
            {scheduleBlocks.length === 0 ? (
              <p className="text-center py-8 text-sm text-muted-foreground">אין חסימות פעילות</p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">חסימות פעילות ({scheduleBlocks.length})</p>
                {scheduleBlocks.map((b: ScheduleBlock) => (
                  <div key={b.id} className="bg-white rounded-2xl border border-border/60 p-3 flex items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-sm font-medium">{formatDate(b.date)}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.time ? `שעה ${b.time}` : "כל היום"}
                        {b.reason ? ` · ${b.reason}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => removeBlock(b.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ BLOCKED PHONES ════════════════════════════════════════════════════ */}
        {tab === "blocked" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-border/60 p-4 space-y-3">
              <p className="text-sm font-semibold">חסימת מספר טלפון</p>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">מספר טלפון *</Label>
                <Input
                  type="tel"
                  placeholder="05x-xxxxxxx"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="rounded-xl border-border/60 h-11"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">סיבה (אופציונלי)</Label>
                <Input
                  placeholder="סיבת החסימה..."
                  value={newPhoneReason}
                  onChange={(e) => setNewPhoneReason(e.target.value)}
                  className="rounded-xl border-border/60 h-11"
                />
              </div>
              <Button
                onClick={blockPhone}
                disabled={!newPhone.trim() || phoneLoading}
                className="w-full rounded-full text-sm h-11 gap-2"
                style={{ background: "oklch(0.55 0.18 40)" }}
              >
                <Ban size={14} />
                חסמי מספר
              </Button>
            </div>

            {blockedPhones.length === 0 ? (
              <p className="text-center py-8 text-sm text-muted-foreground">אין מספרים חסומים</p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">מספרים חסומים ({blockedPhones.length})</p>
                {blockedPhones.map((b: BlockedPhone) => (
                  <div key={b.phone} className="bg-white rounded-2xl border border-border/60 p-3 flex items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-sm font-medium" dir="ltr">{b.phone}</p>
                      {b.reason && <p className="text-xs text-muted-foreground">{b.reason}</p>}
                    </div>
                    <button
                      onClick={() => unblockPhone(b.phone)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      הסרת חסימה
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ REVIEWS ═══════════════════════════════════════════════════════════ */}
        {tab === "reviews" && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center py-8 text-sm text-muted-foreground">אין ביקורות עדיין</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((r: Review) => (
                  <div key={r.id} className="bg-white rounded-2xl border border-border/60 p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                          style={{ background: "oklch(0.55 0.18 222)" }}
                        >
                          {r.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{r.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!r.approved && (
                          <button
                            onClick={() => approveReview(r.id)}
                            className="text-xs px-3 py-1.5 rounded-full text-white gap-1 flex items-center"
                            style={{ background: "oklch(0.55 0.18 145)" }}
                          >
                            אשרי
                          </button>
                        )}
                        {r.approved && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">פורסם</span>
                        )}
                        <button
                          onClick={() => deleteReview(r.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((n) => (
                        <Star key={n} size={12} fill={r.rating >= n ? "currentColor" : "none"} style={{ color: "oklch(0.55 0.18 222)" }} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status legend (only on appointments tab) */}
      {tab === "appointments" && (
        <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-sm border-t border-border/60 px-5 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-5">
            {(["pending", "confirmed", "cancelled"] as const).map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                {s === "confirmed" && <CheckCircle2 size={13} className="text-green-600" />}
                {s === "pending"   && <Timer size={13} className="text-amber-600" />}
                {s === "cancelled" && <XCircle size={13} className="text-red-500" />}
                <span className="text-xs text-muted-foreground">{STATUS_CONFIG[s].label}</span>
              </div>
            ))}
            <span className="text-xs text-muted-foreground opacity-50">· לחצי על הסטטוס לשינוי</span>
          </div>
        </div>
      )}
    </div>
  )
}
