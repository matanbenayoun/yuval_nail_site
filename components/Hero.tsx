import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Paintbrush } from "lucide-react"
import { SITE_CONFIG } from "@/lib/config"

const NAIL_PATH = "M18,3 C11,3 8,10 8,18 C8,26 12,35 18,37 C24,35 28,26 28,18 C28,10 25,3 18,3 Z"

function FloatingNail({ className }: { className: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 36 40" fill="oklch(0.55 0.18 222)" className="w-full h-full">
        <path d={NAIL_PATH} />
      </svg>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, oklch(0.98 0.005 222) 0%, oklch(0.93 0.018 222) 40%, oklch(0.89 0.025 222) 100%)",
        }}
      />
      {/* Decorative blur circles — larger on desktop to fill wide viewport */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 md:w-[52rem] md:h-[52rem] rounded-full opacity-30 md:opacity-40 -z-10"
        style={{ background: "radial-gradient(circle, oklch(0.82 0.05 222), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] md:w-[60rem] md:h-[60rem] rounded-full opacity-20 md:opacity-30 -z-10"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.09 222), transparent 70%)" }}
      />
      {/* Extra center orb — only on desktop to fill the middle */}
      <div
        className="absolute hidden md:block top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full opacity-15 -z-10"
        style={{ background: "radial-gradient(circle, oklch(0.87 0.035 222), transparent 70%)" }}
      />
      {/* Floating nail silhouettes — scale up on desktop */}
      <FloatingNail className="top-[14%] end-[12%] w-6 md:w-10 rotate-[20deg] opacity-[0.07] md:opacity-[0.10] -z-10" />
      <FloatingNail className="top-[28%] start-[7%] w-5 md:w-9 -rotate-[30deg] opacity-[0.05] md:opacity-[0.08] -z-10" />
      <FloatingNail className="top-[55%] end-[6%] w-7 md:w-11 rotate-[10deg] opacity-[0.09] md:opacity-[0.11] -z-10" />
      <FloatingNail className="bottom-[22%] start-[10%] w-5 md:w-9 -rotate-[15deg] opacity-[0.06] md:opacity-[0.09] -z-10" />
      <FloatingNail className="bottom-[12%] end-[20%] w-5 md:w-10 rotate-[40deg] opacity-[0.08] md:opacity-[0.10] -z-10" />

      <div className="max-w-6xl mx-auto px-5 pt-24 pb-16 flex flex-col items-center text-center gap-7">
        {/* Location + specialty badge — wrapped in soft card */}
        <div className="border border-border/40 rounded-2xl px-6 py-3 bg-white/40 backdrop-blur-sm flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-xs tracking-widest text-muted-foreground">
            <Sparkles size={11} />
            <span>סטודיו לציפורניים · {SITE_CONFIG.city}</span>
            <Sparkles size={11} />
          </div>
          <div
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{ background: "oklch(0.90 0.03 222)", color: "oklch(0.45 0.15 222)" }}
          >
            <Paintbrush size={11} />
            <span>מתמחה בציורים בלק ג&apos;ל יד ✋</span>
          </div>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-light leading-tight tracking-tight">
          ציפורניים
          <br />
          <span className="font-semibold" style={{ color: "oklch(0.55 0.18 222)" }}>כאמנות.</span>
        </h1>

        <p className="max-w-sm text-base text-muted-foreground font-light leading-relaxed">
          עיצוב ציפורניים בוטיקי בבאר שבע.
          ציורים מקוריים בלק ג&apos;ל יד, עיצובים מינימליסטיים ופרימיום —
          כל ציפורן מספרת סיפור.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            render={<Link href="/booking" />}
            size="lg"
            className="text-sm px-8 rounded-full h-12 gap-2"
          >
            הזמיני תור
            <ArrowLeft size={14} />
          </Button>
          <Button
            render={<a href="#gallery" />}
            variant="outline"
            size="lg"
            className="text-sm px-8 rounded-full h-12 border-foreground/20 hover:bg-foreground/5"
          >
            לגלריה
          </Button>
        </div>

      </div>
    </section>
  )
}
