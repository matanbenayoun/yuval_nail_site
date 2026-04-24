import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import About from "@/components/About"
import Services from "@/components/Services"
import ColorPalette from "@/components/ColorPalette"
import Gallery from "@/components/Gallery"
import Testimonials from "@/components/Testimonials"
import Footer from "@/components/Footer"
import WhatsAppButton from "@/components/WhatsAppButton"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <ColorPalette />
        <Gallery />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
