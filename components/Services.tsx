import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, Palette, Clock, ArrowLeft } from "lucide-react"

const services = [
  {
    icon: Sparkles,
    name: "מניקור ג'ל",
    description: "ציפוי ג'ל עמיד ומבריק עם שכבת הכנה מושלמת. גימור ללא סדקים שנשאר מושלם ל-3-4 שבועות.",
    duration: "60 דקות",
    price: "₪180",
    tag: "הכי פופולרי",
  },
  {
    icon: RefreshCw,
    name: "תוספות ותחזוקה",
    description: "מילוי לג'ל או אקריל שצמח. עיצוב מחדש, איזון ורענון הסט הקיים למצב מושלם.",
    duration: "45 דקות",
    price: "₪140",
    tag: null,
  },
  {
    icon: Palette,
    name: "אמנות ציפורניים",
    description: "עיצובים מצוירים ביד, אבקות כרום, רדידים ועיטורים תלת-מימדיים. ממינימליסטי למרשים.",
    duration: "90 דקות",
    price: "מ-₪220",
    tag: "פרימיום",
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 gap-3">
          <span className="text-xs tracking-widest text-muted-foreground">מה אנחנו מציעות</span>
          <h2 className="text-3xl md:text-5xl font-semibold">השירותים שלנו</h2>
          <div className="w-10 h-0.5 mt-1" style={{ background: "oklch(0.61 0.072 62)" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card
                key={service.name}
                className="group relative border-border/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {service.tag && (
                  <span
                    className="absolute top-4 start-4 text-[10px] tracking-wide px-3 py-1 rounded-full text-primary-foreground"
                    style={{ background: "oklch(0.61 0.072 62)" }}
                  >
                    {service.tag}
                  </span>
                )}
                <CardContent className="pt-8 pb-7 px-6 flex flex-col gap-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.89 0.022 65)" }}
                  >
                    <Icon size={18} style={{ color: "oklch(0.61 0.072 62)" }} />
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
                      style={{ color: "oklch(0.61 0.072 62)" }}
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
