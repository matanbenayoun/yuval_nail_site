import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Process from "@/components/Process"
import Services from "@/components/Services"
import Testimonials from "@/components/Testimonials"
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
        <Process />
        <Services />
        <Testimonials />
        <ColorPalette />
        <Gallery />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
