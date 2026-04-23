import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Services from "@/components/Services"
import ColorPalette from "@/components/ColorPalette"
import Gallery from "@/components/Gallery"
import Footer from "@/components/Footer"
import WhatsAppButton from "@/components/WhatsAppButton"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <ColorPalette />
        <Gallery />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
