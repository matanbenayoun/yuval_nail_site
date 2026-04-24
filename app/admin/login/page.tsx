"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
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
        router.push("/admin")
      } else {
        const data = await res.json()
        setError(data.error || "שגיאה בכניסה")
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
      style={{ background: "linear-gradient(135deg, oklch(0.98 0.005 222) 0%, oklch(0.89 0.025 222) 100%)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "oklch(0.90 0.03 222)" }}
          >
            <Lock size={22} style={{ color: "oklch(0.55 0.18 222)" }} />
          </div>
          <h1 className="text-xl font-semibold">כניסה לניהול</h1>
          <p className="text-sm text-muted-foreground mt-1">יובל סין ראובן - ציפורניים</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-border/60 p-6 shadow-sm space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm">
              <User size={12} className="inline ms-1" />
              שם משתמש
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-xl border-border/60 h-12"
              autoComplete="username"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm">
              <Lock size={12} className="inline ms-1" />
              סיסמה
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-border/60 h-12"
              autoComplete="current-password"
              dir="ltr"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center bg-destructive/5 rounded-xl py-2 px-3">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full text-sm h-12"
            disabled={loading}
          >
            {loading ? "מתחברת..." : "כניסה"}
          </Button>
        </form>
      </div>
    </div>
  )
}
