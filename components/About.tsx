import { ImageIcon, Heart, Award, MapPin } from "lucide-react"

const highlights = [
  { icon: Award, text: "3 שנות ניסיון מקצועי בעיצוב ציפורניים" },
  { icon: Heart, text: "מתמחה בציורים מקוריים בלק ג׳ל יד" },
  { icon: MapPin, text: "סטודיו פרטי בבאר שבע" },
]

export default function About() {
  return (
    <section id="about" className="py-20 px-5 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* Image — appears on the right in RTL */}
          <div className="w-full md:w-[38%] shrink-0">
            <div className="relative">
              {/* Decorative background blob */}
              <div
                className="absolute -bottom-4 -start-4 w-full h-full rounded-3xl -z-10"
                style={{ background: "oklch(0.90 0.03 222)" }}
              />

              {/* Image placeholder */}
              <div
                className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-border/40 flex flex-col items-center justify-center gap-4"
                style={{
                  background: "linear-gradient(160deg, oklch(0.96 0.012 222) 0%, oklch(0.92 0.025 222) 100%)",
                }}
              >
                <div
                  className="absolute top-6 end-6 w-2 h-2 rounded-full opacity-40"
                  style={{ background: "oklch(0.55 0.18 222)" }}
                />
                <div
                  className="absolute top-12 end-10 w-1 h-1 rounded-full opacity-25"
                  style={{ background: "oklch(0.55 0.18 222)" }}
                />
                <div
                  className="absolute bottom-10 start-8 w-2.5 h-2.5 rounded-full opacity-30"
                  style={{ background: "oklch(0.55 0.18 222)" }}
                />

                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.88 0.035 222)" }}
                >
                  <ImageIcon size={28} style={{ color: "oklch(0.55 0.18 222)" }} />
                </div>
                <div className="flex flex-col items-center gap-1 text-center px-6">
                  <p className="text-sm font-medium" style={{ color: "oklch(0.55 0.18 222)" }}>
                    תמונה תועלה כאן
                  </p>
                  <p className="text-xs text-muted-foreground">תמונה אישית / פרופיל</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col gap-6 flex-1 text-center md:text-start">
            {/* Section header */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <span className="text-xs tracking-widest text-muted-foreground">קצת עליי</span>
              <h2 className="text-3xl md:text-5xl font-semibold">שמי יובל<br className="hidden md:block" /> סין ראובן</h2>
              <div className="w-10 h-0.5" style={{ background: "oklch(0.55 0.18 222)" }} />
            </div>

            {/* Bio — placeholder text */}
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                [פסקה ראשונה — ספרי קצת על עצמך: מה הוביל אותך לעולם הציפורניים, מתי התחלת, ומה מייחד אותך כאמנית.]
              </p>
              <p>
                [פסקה שנייה — ניתן לכתוב על הסגנון שלך, על מה שאת אוהבת ליצור, או על האווירה שאת בונה בסטודיו.]
              </p>
            </div>

            {/* Highlights */}
            <div className="flex flex-col gap-3 pt-2">
              {highlights.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 justify-center md:justify-start">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "oklch(0.90 0.03 222)" }}
                  >
                    <Icon size={15} style={{ color: "oklch(0.55 0.18 222)" }} />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
