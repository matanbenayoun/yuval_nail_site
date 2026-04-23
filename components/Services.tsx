import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, Paintbrush, Clock, ArrowLeft, Star } from "lucide-react"

const services = [
  {
    icon: Sparkles,
    name: "מניקור ג'ל",
    description: "ציפוי ג'ל עמיד ומבריק עם שכבת הכנה מושלמת. גימור ללא סדקים שנשאר מושלם ל-3-4 שבועות.",
    duration: "60 דקות",
    price: "₪180",
    tag: null,
    highlight: false,
  },
  {
    icon: Paintbrush,
    name: "ציורים בלק ג'ל יד",
    description: "עיצובים מקוריים מצוירים ביד בלק ג'ל — השירות הייחודי של יובל. פרחים, נוף, אבסטרקט ועוד. כל עיצוב חד-פעמי.",
    duration: "90 דקות",
    price: "מ-₪220",
    tag: "הייחוד שלנו",
    highlight: true,
  },
  {
    icon: RefreshCw,
    name: "תוספות ותחזוקה",
    description: "מילוי לג'ל או אקריל שצמח. עיצוב מחדש, איזון ורענון הסט הקיים למצב מושלם.",
    duration: "45 דקות",
    price: "₪140",
    tag: null,
    highlight: false,
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 gap-3">
          <span className="text-xs tracking-widest text-muted-foreground">מה אנחנו מציעות</span>
          <h2 className="text-3xl md:text-5xl font-semibold">השירותים שלנו</h2>
          <div className="w-10 h-0.5 mt-1" style={{ background: "oklch(0.55 0.18 222)" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card
                key={service.name}
                className={`group relative hover:shadow-lg transition-all duration-300 overflow-hidden ${
                  service.highlight
                    ? "border-2"
                    : "border border-border/60"
                }`}
                style={service.highlight ? { borderColor: "oklch(0.55 0.18 222)" } : {}}
              >
                {service.tag && (
                  <span
                    className="absolute top-4 start-4 text-[10px] tracking-wide px-3 py-1 rounded-full text-primary-foreground flex items-center gap-1"
                    style={{ background: "oklch(0.55 0.18 222)" }}
                  >
                    <Star size={9} fill="currentColor" />
                    {service.tag}
                  </span>
                )}

                {/* Highlight glow */}
                {service.highlight && (
                  <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ background: "oklch(0.55 0.18 222)" }}
                  />
                )}

                <CardContent className="pt-8 pb-7 px-6 flex flex-col gap-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.90 0.03 222)" }}
                  >
                    <Icon size={18} style={{ color: "oklch(0.55 0.18 222)" }} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>

                  <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>{service.duration}</span>
                    </div>
                    <span
                      className="text-base font-semibold me-auto"
                      style={{ color: "oklch(0.55 0.18 222)" }}
                    >
                      {service.price}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-center mt-10">
          <Button
            render={<Link href="/booking" />}
            variant="outline"
            className="text-sm px-8 rounded-full h-12 gap-2 border-foreground/20"
          >
            הזמיני תור <ArrowLeft size={13} />
          </Button>
        </div>
      </div>
    </section>
  )
}
