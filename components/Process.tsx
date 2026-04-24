import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays, CheckCircle, Sparkles, ArrowLeft } from "lucide-react"

const steps = [
  {
    number: "1",
    icon: CalendarDays,
    title: "בחרי שירות ותאריך",
    desc: "דרך האתר תוך דקות. כל השעות הפנויות גלויות מראש.",
  },
  {
    number: "2",
    icon: CheckCircle,
    title: "קבלי אישור מיידי",
    desc: "תקבלי אישור ותזכורת לפני התור — בלי להתאמץ.",
  },
  {
    number: "3",
    icon: Sparkles,
    title: "הגיעי ותיהני",
    desc: "ברכי רבע שעה לפני. יובל תדאג לכל השאר.",
  },
]

export default function Process() {
  return (
    <section className="py-20 px-5 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14 gap-3">
          <span className="text-xs tracking-widest text-muted-foreground">איך זה עובד</span>
          <h2 className="text-3xl md:text-5xl font-semibold">שלושה צעדים פשוטים</h2>
          <div className="w-10 h-0.5 mt-1" style={{ background: "oklch(0.55 0.18 222)" }} />
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-start gap-10 md:gap-0">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <>
                <div key={step.number} className="flex-1 flex flex-col items-center text-center gap-3 px-4">
                  {/* Number circle */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-semibold leading-none"
                    style={{ background: "oklch(0.90 0.03 222)", color: "oklch(0.55 0.18 222)" }}
                  >
                    {step.number}
                  </div>
                  {/* Icon */}
                  <Icon size={20} style={{ color: "oklch(0.55 0.18 222)" }} />
                  <h3 className="text-base font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">{step.desc}</p>
                </div>
                {/* Connector arrow between steps (desktop only) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center pt-7 shrink-0">
                    <ArrowLeft size={18} className="text-border" />
                  </div>
                )}
              </>
            )
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <Button
            render={<Link href="/booking" />}
            size="lg"
            className="text-sm px-10 rounded-full h-12 gap-2"
          >
            הזמיני עכשיו
            <ArrowLeft size={14} />
          </Button>
        </div>
      </div>
    </section>
  )
}
