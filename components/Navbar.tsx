"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import InstagramIcon from "@/components/InstagramIcon"
import Logo from "@/components/Logo"
import { SITE_CONFIG } from "@/lib/config"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/">
          <Logo size="sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-light">
          <a href="#services" className="hover:opacity-60 transition-opacity">שירותים</a>
          <a href="#gallery" className="hover:opacity-60 transition-opacity">גלריה</a>
          <a
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60 transition-opacity flex items-center gap-1.5"
            aria-label="Instagram"
          >
            <InstagramIcon size={17} />
          </a>
        </nav>

        <div className="hidden md:block">
          <Button render={<Link href="/booking" />} className="text-sm px-6 rounded-full">
            הזמיני תור
          </Button>
        </div>

        <button
          className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="פתח תפריט"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-5 py-5 flex flex-col gap-1">
          <a href="#services" className="py-3 text-base font-light" onClick={() => setMenuOpen(false)}>שירותים</a>
          <a href="#gallery" className="py-3 text-base font-light" onClick={() => setMenuOpen(false)}>גלריה</a>
          <a
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 text-base font-light flex items-center gap-2"
            onClick={() => setMenuOpen(false)}
          >
            <InstagramIcon size={18} />
            Instagram
          </a>
          <div className="pt-3 border-t border-border mt-1">
            <Button
              render={<Link href="/booking" onClick={() => setMenuOpen(false)} />}
              className="w-full text-sm rounded-full"
            >
              הזמיני תור
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
