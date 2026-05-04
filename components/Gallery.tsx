"use client"

import { useGallery } from "@/context/GalleryContext"

export default function Gallery() {
  const { images } = useGallery()
  const realImages = images.filter((i) => i.source === "static" || i.source === "upload")

  return (
    <section id="gallery" className="py-20 px-5" style={{ background: "oklch(0.96 0.01 222)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 gap-3">
          <span className="text-xs tracking-widest text-muted-foreground">העבודות שלנו</span>
          <h2 className="text-3xl md:text-5xl font-semibold">הגלריה שלנו</h2>
          <div className="w-10 h-0.5 mt-1" style={{ background: "oklch(0.55 0.18 222)" }} />
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            פלטת הצבעים והעיצובים הייחודיים שלנו.
          </p>
        </div>

        {realImages.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-16">
            הגלריה ריקה כרגע. יובל תעלה תמונות בקרוב ✨
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {realImages.map((image, index) => (
              <div
                key={image.id}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                  index === 0 ? "md:col-span-2" : ""
                } ${index === 4 ? "md:col-span-2" : ""}`}
                style={{ background: image.background, aspectRatio: "3/4" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />

                <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center">
                    <span className="text-sm font-medium" style={{ color: "oklch(0.27 0.015 35)" }}>
                      {image.name}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-3 start-0 end-0 flex justify-center md:hidden">
                  <span className="text-[10px] text-white/90 bg-black/20 px-3 py-1 rounded-full">
                    {image.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">
          עקבי אחרינו{" "}
          <span className="underline underline-offset-4" style={{ color: "oklch(0.55 0.18 222)" }}>
            @yuval_sin_reuven_nail
          </span>{" "}
          באינסטגרם לעוד עיצובים
        </p>
      </div>
    </section>
  )
}
