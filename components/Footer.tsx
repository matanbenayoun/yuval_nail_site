import Link from "next/link"
import { Heart, Phone, MapPin, Navigation } from "lucide-react"
import InstagramIcon from "@/components/InstagramIcon"
import { SITE_CONFIG, whatsappHref } from "@/lib/config"

export default function Footer() {
  return (
    <footer className="border-t border-border/60 py-10 px-5">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold">{SITE_CONFIG.name}</span>
            <span className="text-xs text-muted-foreground tracking-wide">
              סטודיו לציפורניים · {SITE_CONFIG.city}
            </span>
          </div>

          {/* Contact info */}
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin size={13} />
              <span>{SITE_CONFIG.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={13} />
              <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-foreground transition-colors" dir="ltr">
                {SITE_CONFIG.phone}
              </a>
            </div>
          </div>

          {/* Social + links */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon size={16} />
              <span className="text-xs">@{SITE_CONFIG.instagram}</span>
            </a>

            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="WhatsApp"
            >
              <Heart size={14} />
              <span className="text-xs">WhatsApp</span>
            </a>

            <Link
              href="/admin"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ניהול
            </Link>
          </div>
        </div>

        {/* Navigate to studio buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 border-t border-border/40">
          <p className="text-xs text-muted-foreground text-center sm:text-start self-center">
            <MapPin size={11} className="inline ms-1" />
            נווטי אלינו:
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href={SITE_CONFIG.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-full border border-border/60 hover:border-primary/40 hover:bg-accent transition-colors min-h-[44px]"
            >
              <Navigation size={13} />
              Waze
            </a>
            <a
              href={SITE_CONFIG.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-full border border-border/60 hover:border-primary/40 hover:bg-accent transition-colors min-h-[44px]"
            >
              <MapPin size={13} />
              Google Maps
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-5 border-t border-border/40 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE_CONFIG.name} — {SITE_CONFIG.subtitle}. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  )
}
