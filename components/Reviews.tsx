"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Send, CheckCircle } from "lucide-react"
import type { Review } from "@/lib/types"

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHovered(n)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          aria-label={`דירוג ${n}`}
        >
          <Star
            size={onChange ? 22 : 14}
            fill={(hovered || value) >= n ? "currentColor" : "none"}
            style={{ color: "oklch(0.55 0.18 222)" }}
          />
        </button>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!name.trim()) { setError("נא להזין שם."); return }
    if (!text.trim() || text.trim().length < 10) { setError("נא לכתוב ביקורת (לפחות 10 תווים)."); return }
    if (!rating) { setError("נא לבחור דירוג."); return }

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), text: text.trim(), rating }),
    })

    if (res.ok) {
      setSubmitted(true)
    } else {
      setError("שגיאה בשליחה, נסי שוב.")
    }
  }

  return (
    <section id="reviews" className="py-20 px-5" style={{ background: "oklch(0.96 0.01 222)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 gap-3">
          <span className="text-xs tracking-widest text-muted-foreground">מה אומרות הלקוחות</span>
          <h2 className="text-3xl md:text-5xl font-semibold">ביקורות</h2>
          <div className="w-10 h-0.5 mt-1" style={{ background: "oklch(0.55 0.18 222)" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Existing reviews */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                עדיין אין ביקורות. היי הראשונה! 💅
              </p>
            ) : (
              reviews.map((r) => (
                <Card key={r.id} className="border border-border/60">
                  <CardContent className="pt-5 pb-4 px-5 space-y-3">
                    <StarRating value={r.rating} />
                    <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                        style={{ background: "oklch(0.55 0.18 222)" }}
                      >
                        {r.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{r.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Submit form */}
          <div>
            <Card className="border border-border/60 bg-white">
              <CardContent className="pt-6 pb-5 px-5">
                {submitted ? (
                  <div className="flex flex-col items-center gap-4 py-6 text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "oklch(0.90 0.03 222)" }}
                    >
                      <CheckCircle size={22} style={{ color: "oklch(0.55 0.18 222)" }} />
                    </div>
                    <div>
                      <p className="font-semibold">תודה על הביקורת!</p>
                      <p className="text-sm text-muted-foreground mt-1">הביקורת שלך תפורסם לאחר אישור.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-base font-semibold">השאירי ביקורת</h3>

                    <div className="space-y-1.5">
                      <Label htmlFor="review-name" className="text-xs text-muted-foreground">שם</Label>
                      <Input
                        id="review-name"
                        placeholder="השם שלך"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-xl border-border/60 h-11"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">דירוג</Label>
                      <StarRating value={rating} onChange={setRating} />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="review-text" className="text-xs text-muted-foreground">הביקורת שלך</Label>
                      <Textarea
                        id="review-text"
                        placeholder="ספרי על החוויה שלך..."
                        value={text}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                        className="rounded-xl border-border/60 min-h-[100px] resize-none"
                        required
                        minLength={10}
                      />
                    </div>

                    {error && (
                      <p className="text-xs text-destructive">{error}</p>
                    )}

                    <Button type="submit" className="w-full rounded-full text-sm h-11 gap-2">
                      <Send size={13} />
                      שליחת ביקורת
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
