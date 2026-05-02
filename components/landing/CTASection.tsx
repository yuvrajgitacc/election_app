'use client'

export default function CTASection() {
  const scrollToPicker = () => {
    document.getElementById('country-picker')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section style={{
      width: '100%',
      background: 'var(--background)',
      padding: '140px 24px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 5vw, 60px)',
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          marginBottom: '20px'
        }}>
          Democracy starts with understanding.
        </h2>
        <p style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          marginBottom: '40px',
          lineHeight: 1.7
        }}>
          Join civic learners from every corner of the world.
        </p>
        <button
          onClick={scrollToPicker}
          style={{
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            height: '52px',
            padding: '0 32px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          Get started — it is free
        </button>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginTop: '16px'
        }}>
          No account required to explore
        </p>
      </div>
    </section>
  )
}
