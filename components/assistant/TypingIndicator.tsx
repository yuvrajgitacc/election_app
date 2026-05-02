'use client'

import { motion } from 'framer-motion'

export default function TypingIndicator() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '8px 0'
    }}>
      <div style={{
        width: '32px', height: '32px',
        borderRadius: '50%',
        background: 'var(--accent)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: '14px', color: 'white',
        fontWeight: 500
      }}>
        V
      </div>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px 16px 16px 16px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: 'var(--text-muted)'
            }}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </div>
  )
}
