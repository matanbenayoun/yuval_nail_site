import Link from "next/link"
import { Heart, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border/60 py-10 px-5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold">יובל סין ראובן</span>
          <span className="text-xs text-muted-foreground tracking-wide">סטודיו לציפורניים · תל אביב</span>
        </div>

        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin size={13} />
            <span>רחוב דיזנגוף 55, תל אביב</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={13} />
            <span>052-000-0000</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Heart size={14} />
            <span className="text-xs">@yuval.nails</span>
          </a>
          <Link
            href="/admin"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ניהול
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-5 border-t border-border/40 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} יובל סין ראובן - ציפורניים. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  )
}
