import { Heart, Award, MapPin } from "lucide-react"

const highlights = [
  { icon: Award, text: "3 שנות ניסיון מקצועי בעיצוב ציפורניים" },
  { icon: Heart, text: "מתמחה בציורים מקוריים בלק ג׳ל יד" },
  { icon: MapPin, text: "סטודיו פרטי בבאר שבע" },
]

export default function About() {
  return (
    <section id="about" className="py-20 px-5 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center gap-8 max-w-2xl mx-auto">
          {/* Section header */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs tracking-widest text-muted-foreground">קצת עליי</span>
            <h2 className="text-3xl md:text-5xl font-semibold">שמי יובל סין ראובן</h2>
            <div className="w-10 h-0.5" style={{ background: "oklch(0.55 0.18 222)" }} />
          </div>

          {/* Bio */}
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              [פסקה ראשונה — ספרי קצת על עצמך: מה הוביל אותך לעולם הציפורניים, מתי התחלת, ומה מייחד אותך כאמנית.]
            </p>
            <p>
              [פסקה שנייה — ניתן לכתוב על הסגנון שלך, על מה שאת אוהבת ליצור, או על האווירה שאת בונה בסטודיו.]
            </p>
          </div>

          {/* Highlights */}
          <div className="flex flex-col gap-3 pt-2 w-full">
            {highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 justify-center">
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
    </section>
  )
}
