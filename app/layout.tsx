import type { Metadata } from "next"
import { Heebo } from "next/font/google"
import { Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { BookingProvider } from "@/context/BookingContext"
import { GalleryProvider } from "@/context/GalleryContext"

const heebo = Heebo({
  variable: "--font-sans",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: "יובל סין ראובן - ציפורניים",
  description: "עיצוב ציפורניים מקצועי ואישי. הזמיני תור אונליין.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <GalleryProvider>
          <BookingProvider>{children}</BookingProvider>
        </GalleryProvider>
      </body>
    </html>
  )
}
