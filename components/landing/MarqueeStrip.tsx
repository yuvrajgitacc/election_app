'use client'
import { countries } from '@/lib/countries'

export default function MarqueeStrip() {
  const items = [...countries, ...countries]
  return (
    <div style={{
      width: '100%',
      background: '#5b6ef5',
      height: '44px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'flex',
        whiteSpace: 'nowrap',
        animation: 'marquee 60s linear infinite'
      }}>
        {items.map((country, i) => (
          <span key={i} style={{
            fontSize: '13px',
            color: 'white',
            fontWeight: 300,
            padding: '0 4px',
            flexShrink: 0
          }}>
            {country.name} ◆&nbsp;
          </span>
        ))}
      </div>
    </div>
  )
}
