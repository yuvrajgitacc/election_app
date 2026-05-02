import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/landing/HeroSection'
import CountryPicker from '@/components/landing/CountryPicker'
import HowItWorks from '@/components/landing/HowItWorks'
import MarqueeStrip from '@/components/landing/MarqueeStrip'
import CTASection from '@/components/landing/CTASection'
import GlobalChat from '@/components/chat/GlobalChat'

export default function Home() {
  return (
    <main style={{ 
      background: 'var(--background)', 
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden'
    }}>
      <Navbar />
      <HeroSection />
      <section 
        id="country-picker" 
        style={{ 
          width: '100%',
          background: 'var(--background)',
          padding: '120px 24px'
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <CountryPicker />
        </div>
      </section>
      <section 
        id="how-it-works"
        style={{ width: '100%' }}
      >
        <HowItWorks />
      </section>
      <MarqueeStrip />
      <CTASection />
      <Footer />
      <GlobalChat />
    </main>
  )
}
