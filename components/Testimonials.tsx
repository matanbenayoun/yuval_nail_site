import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const reviews = [
  {
    name: "מיה כהן",
    text: "יובל פשוט קסומה. ביקשתי עיצוב פרחים עדין בלק ג'ל — יצא בדיוק כמו שדמיינתי, אפילו יותר יפה. כל ציפורן יצירת אמנות. לקוחה קבועה מזה שנה ולא מחליפה!",
  },
  {
    name: "שיר לוי",
    text: "מקצועית ואישית ביחד. יובל מאזינה, מייעצת, ותוצאה תמיד מדהימה. הג'ל נשאר שלם ומבריק שלושה שבועות. ממליצה בחום לכל מי שרוצה ציפורניים מושלמות בבאר שבע!",
  },
  {
    name: "נועה אברהם",
    text: "הזמנתי תור אונליין וזה היה כל כך נוח. אווירה נפלאה, יובל עם חיוך גדול. ציור האבסטרקט שעשתה לי קיבל המון מחמאות מכולם. תודה רבה!",
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} fill="currentColor" style={{ color: "oklch(0.55 0.18 222)" }} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-20 px-5" style={{ background: "oklch(0.96 0.01 222)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 gap-3">
          <span className="text-xs tracking-widest text-muted-foreground">מה אומרות הלקוחות</span>
          <h2 className="text-3xl font-semibold">הן מדברות, לא אנחנו</h2>
          <div className="w-10 h-0.5 mt-1" style={{ background: "oklch(0.55 0.18 222)" }} />
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 gap-5">
          {reviews.map((review) => (
            <Card key={review.name} className="border border-border/60 shadow-none">
              <CardContent className="pt-6 pb-6 px-6 flex flex-col gap-4 h-full">
                <Stars />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-border/50 mt-auto">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{ background: "oklch(0.55 0.18 222)", color: "oklch(0.99 0.003 222)" }}
                  >
                    {review.name[0]}
                  </div>
                  <span className="text-sm font-medium">{review.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
