"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User } from "lucide-react"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        window.location.href = "/admin"
      } else {
        try {
          const data = await res.json()
          setError(data.error || "שגיאה בכניסה")
        } catch {
          setError(`שגיאת שרת (${res.status})`)
        }
      }
    } catch {
      setError("שגיאת רשת, נסי שוב")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ background: "linear-gradient(135deg, #eef4fc 0%, #d8eaf8 100%)", colorScheme: "light" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "#dbeafe" }}
          >
            <Lock size={22} style={{ color: "#2563eb" }} />
          </div>
          <h1 className="text-xl font-semibold" style={{ color: "#1e293b" }}>כניסה לניהול</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>יובל סין ראובן - ציפורניים</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "white", colorScheme: "light" }} className="rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm" style={{ color: "#374151" }}>
              <User size={12} className="inline ms-1" />
              שם משתמש
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-xl h-12"
              style={{ background: "white", color: "#1e293b", borderColor: "#cbd5e1" }}
              autoComplete="username"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm" style={{ color: "#374151" }}>
              <Lock size={12} className="inline ms-1" />
              סיסמה
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl h-12"
              style={{ background: "white", color: "#1e293b", borderColor: "#cbd5e1" }}
              autoComplete="current-password"
              dir="ltr"
            />
          </div>

          {error && (
            <p
              className="text-sm text-center rounded-xl py-2 px-3"
              style={{ color: "#b91c1c", background: "#fee2e2" }}
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full text-sm h-12"
            style={{ background: "#2563eb", color: "white" }}
            disabled={loading}
          >
            {loading ? "מתחברת..." : "כניסה"}
          </Button>
        </form>
      </div>
    </div>
  )
}
