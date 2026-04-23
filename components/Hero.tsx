import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Paintbrush } from "lucide-react"
import { SITE_CONFIG } from "@/lib/config"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, oklch(0.98 0.005 222) 0%, oklch(0.93 0.018 222) 40%, oklch(0.89 0.025 222) 100%)",
        }}
      />
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-30 -z-10"
        style={{ background: "radial-gradient(circle, oklch(0.82 0.05 222), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full opacity-20 -z-10"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.09 222), transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-5 pt-24 pb-16 flex flex-col items-center text-center gap-7">
        {/* Location + specialty badge */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-xs tracking-widest text-muted-foreground">
            <Sparkles size={11} />
            <span>סטודיו לציפורניים · {SITE_CONFIG.city}</span>
            <Sparkles size={11} />
          </div>
          {/* Specialty pill */}
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

        <div className="flex gap-10 mt-2 pt-8 border-t border-border/60 w-full justify-center">
          {[
            { value: "+500", label: "לקוחות מרוצות" },
            { value: "3", label: "שנות ניסיון" },
            { value: "100%", label: "ציורי יד" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl md:text-3xl font-semibold" style={{ color: "oklch(0.55 0.18 222)" }}>
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
