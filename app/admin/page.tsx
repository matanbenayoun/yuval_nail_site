"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useBooking, type AppointmentStatus } from "@/context/BookingContext"
import { useGallery } from "@/context/GalleryContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarDays, Clock, User, Phone, Search, LogOut, Trash2, ImagePlus, Home, CheckCircle2, XCircle, Timer } from "lucide-react"

// ─── Status config ───────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<AppointmentStatus, { label: string; next: AppointmentStatus; className: string }> = {
  pending:   { label: "ממתין",  next: "confirmed",  className: "bg-amber-50  text-amber-700  border-amber-200"  },
  confirmed: { label: "אושר",   next: "cancelled",  className: "bg-green-50  text-green-700  border-green-200"  },
  cancelled: { label: "בוטל",   next: "pending",    className: "bg-red-50    text-red-500    border-red-200"    },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("he-IL", { weekday: "short", day: "numeric", month: "short" })
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { appointments, updateStatus } = useBooking()
  const { images, addImage, removeImage } = useGallery()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [tab, setTab] = useState<"appointments" | "gallery">("appointments")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all")

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    files.forEach(addImage)
    e.target.value = ""
  }

  // ── Filtered & sorted appointments ──────────────────────────────────────────
  const filtered = appointments
    .filter((a) => {
      const matchSearch =
        a.name.includes(search) ||
        a.service.includes(search) ||
        a.date.includes(search) ||
        a.phone.includes(search)
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

  return (
    <div className="min-h-screen pb-24" style={{ background: "oklch(0.97 0.006 65)" }}>

      {/* ── Fixed Header ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-border/60">
        <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
          <div>
            <p className="text-base font-semibold leading-none">לוח בקרה</p>
            <p className="text-xs text-muted-foreground mt-0.5">יובל סין ראובן</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              render={<Link href="/" />}
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="חזרה לאתר"
            >
              <Home size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground"
              onClick={handleLogout}
              aria-label="יציאה"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-5">

        {/* ── Stats ──────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "סה\"כ", value: stats.total, icon: CalendarDays, color: "oklch(0.61 0.072 62)" },
            { label: "היום",  value: stats.today,  icon: Clock,         color: "oklch(0.55 0.15 145)" },
            { label: "ממתינים", value: stats.pending, icon: Timer,      color: "oklch(0.65 0.14 65)"  },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-border/60 p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <Icon size={13} style={{ color }} />
              </div>
              <span className="text-3xl font-semibold leading-none" style={{ color }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────────────── */}
        <div className="flex bg-white rounded-2xl border border-border/60 p-1 gap-1">
          {(["appointments", "gallery"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                tab === t
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={tab === t ? { background: "oklch(0.61 0.072 62)" } : {}}
            >
              {t === "appointments" ? "📅 תורים" : "🖼️ גלריה"}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            APPOINTMENTS TAB
        ══════════════════════════════════════════════════════════════════════ */}
        {tab === "appointments" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="חיפוש לפי שם, שירות, טלפון..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pe-10 rounded-xl border-border/60 h-12 bg-white"
              />
            </div>

            {/* Status filter pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`flex-none px-4 py-2 rounded-full text-xs font-medium border transition-all min-h-[36px] whitespace-nowrap ${
                    statusFilter === s
                      ? "text-primary-foreground border-transparent"
                      : "bg-white border-border/60 text-muted-foreground hover:border-border"
                  }`}
                  style={statusFilter === s ? { background: "oklch(0.61 0.072 62)" } : {}}
                >
                  {s === "all" ? "הכל" : STATUS_CONFIG[s].label}
                  {s !== "all" && (
                    <span className="ms-1 opacity-70">
                      ({appointments.filter((a) => a.status === s).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Appointment cards */}
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                לא נמצאו תורים
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((apt) => {
                  const statusCfg = STATUS_CONFIG[apt.status]
                  return (
                    <div
                      key={apt.id}
                      className="bg-white rounded-2xl border border-border/60 p-4 flex gap-4"
                    >
                      {/* Date block */}
                      <div
                        className="flex flex-col items-center justify-center rounded-xl px-3 py-2 min-w-[58px] shrink-0"
                        style={{ background: "oklch(0.89 0.022 65)" }}
                      >
                        <span
                          className="text-xl font-semibold leading-none"
                          style={{ color: "oklch(0.52 0.078 60)" }}
                        >
                          {new Date(apt.date).getDate()}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(apt.date).toLocaleString("he-IL", { month: "short" })}
                        </span>
                        <span className="text-xs font-medium mt-1" style={{ color: "oklch(0.52 0.078 60)" }}>
                          {apt.time}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <User size={12} className="text-muted-foreground shrink-0" />
                            <span className="text-sm font-medium truncate">{apt.name}</span>
                          </div>
                          {/* Status toggle badge */}
                          <button
                            onClick={() => updateStatus(apt.id, statusCfg.next)}
                            title="לחצי לשינוי סטטוס"
                          >
                            <Badge
                              variant="outline"
                              className={`text-[10px] shrink-0 cursor-pointer hover:opacity-80 transition-opacity ${statusCfg.className}`}
                            >
                              {statusCfg.label}
                            </Badge>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-muted-foreground" />
                          <a
                            href={`tel:${apt.phone}`}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            dir="ltr"
                          >
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

        {/* ══════════════════════════════════════════════════════════════════════
            GALLERY TAB
        ══════════════════════════════════════════════════════════════════════ */}
        {tab === "gallery" && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full rounded-2xl h-14 border-dashed border-2 text-sm gap-2 border-primary/30 hover:border-primary/60 hover:bg-accent"
            >
              <ImagePlus size={18} style={{ color: "oklch(0.61 0.072 62)" }} />
              העלאת תמונה
            </Button>

            {images.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground text-sm">
                אין תמונות בגלריה עדיין
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {images.map((img) => (
                  <div key={img.id} className="relative group rounded-2xl overflow-hidden aspect-square">
                    <div
                      className="absolute inset-0"
                      style={{ background: img.background }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />

                    {/* Name label */}
                    <div className="absolute bottom-0 start-0 end-0 px-3 py-2 bg-gradient-to-t from-black/40 to-transparent">
                      <p className="text-xs text-white font-medium truncate">{img.name}</p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 end-2 w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      aria-label="מחקי תמונה"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center pb-2">
              {images.length} תמונות בגלריה · שינויים מיד גלויים לציבור
            </p>
          </div>
        )}
      </div>

      {/* ── Fixed bottom legend for status ────────────────────────────────────── */}
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
    </div>
  )
}
