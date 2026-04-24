"use client"

import { useState } from "react"

const PALETTE = [
  // Neutrals
  { name: "לבן שלג",    hex: "#FAFAF5", border: true },
  { name: "שמנת",      hex: "#F5EEE4", border: false },
  { name: "בז' עדין",  hex: "#EDD9C0", border: false },
  { name: "טופי",      hex: "#D4B896", border: false },
  { name: "קאמל",      hex: "#B88C60", border: false },
  // Pinks
  { name: "ורוד תינוק", hex: "#F8D8E0", border: false },
  { name: "ורוד עדין",  hex: "#ECAAC0", border: false },
  { name: "ורוד",       hex: "#D07090", border: false },
  { name: "פוקסיה",     hex: "#C02070", border: false },
  { name: "מיוי",       hex: "#A81060", border: false },
  // Reds
  { name: "קורל",       hex: "#E87060", border: false },
  { name: "אדום",       hex: "#C82830", border: false },
  { name: "בורגוני",    hex: "#901828", border: false },
  { name: "טרה קוטה",   hex: "#C05838", border: false },
  { name: "חמרה",       hex: "#A04028", border: false },
  // Purples
  { name: "לילך",       hex: "#DBBCE0", border: false },
  { name: "סגול",       hex: "#A870C0", border: false },
  { name: "סגול עמוק",  hex: "#7840A0", border: false },
  { name: "ברקן",       hex: "#501870", border: false },
  // Blues & Teals
  { name: "תכלת",       hex: "#A0C8E8", border: false },
  { name: "שמיים",      hex: "#70A8D8", border: false },
  { name: "ים",         hex: "#4080C0", border: false },
  { name: "כחול כהה",   hex: "#1848A0", border: false },
  { name: "מנטה",       hex: "#B8E0C8", border: false },
  { name: "ירוק",       hex: "#58A878", border: false },
  // Metallics & Specials
  { name: "זהב",        hex: "#D4AF37", border: false },
  { name: "כסף",        hex: "#B8C0C8", border: false },
  { name: "רוז גולד",   hex: "#E8A090", border: false },
  { name: "גלקסי",      hex: "#2C2860", border: false },
  { name: "שחור",       hex: "#1E1E1E", border: false },
]

export default function ColorPalette() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section className="py-16 px-5 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10 gap-3">
          <span className="text-xs tracking-widest text-muted-foreground">הגוונים שלנו</span>
          <h2 className="text-3xl font-semibold">מנעד הגוונים שלי</h2>
          <div className="w-10 h-0.5 mt-1" style={{ background: "oklch(0.55 0.18 222)" }} />
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            מגוון גוונים לכל מצב רוח וסגנון — מניוטרל עדין ועד אדום נועז.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {PALETTE.map((color) => (
            <div
              key={color.hex}
              className="relative flex flex-col items-center gap-1.5"
              onMouseEnter={() => setHovered(color.hex)}
              onMouseLeave={() => setHovered(null)}
            >
              <button
                type="button"
                className="w-10 h-10 rounded-full shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{
                  background: color.hex,
                  border: color.border ? "1.5px solid oklch(0.85 0.01 222)" : "none",
                }}
                aria-label={color.name}
                title={color.name}
              />
              {hovered === color.hex && (
                <span
                  className="absolute -bottom-7 whitespace-nowrap text-[10px] font-medium px-2 py-0.5 rounded-full text-white shadow-md z-10"
                  style={{ background: "oklch(0.27 0.015 35)" }}
                >
                  {color.name}
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          לא מוצאת את הגוון המושלם? צרי קשר ונמצא ביחד 💙
        </p>
      </div>
    </section>
  )
}
