import Link from "next/link"
import { ArrowRight } from "lucide-react"
import BookingForm from "@/components/BookingForm"

export default function BookingPage() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.98 0.004 65)" }}>
      <div className="border-b border-border/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-5 h-16 flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-semibold leading-none">הזמיני תור</h1>
            <p className="text-xs text-muted-foreground mt-0.5">יובל סין ראובן - ציפורניים</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-8">
        <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">
          בחרי תאריך, שעה ושירות מועדפים.
          <br />ימי ראשון סגורים.
        </p>
        <BookingForm />
      </div>
    </div>
  )
}
