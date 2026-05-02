'use client'

import { motion } from 'framer-motion'
import { User } from 'lucide-react'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  countryName?: string
}

export default function MessageBubble({ 
  role, content, countryName 
}: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        flexDirection: isUser ? 'row-reverse' : 'row',
        padding: '4px 0'
      }}
    >
      <div style={{
        width: '32px', height: '32px',
        borderRadius: '50%',
        background: isUser ? 'var(--surface-2)' : 'var(--accent)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {isUser 
          ? <User size={14} color="var(--text-secondary)" />
          : <span style={{ fontSize: '14px', color: 'white', 
              fontWeight: 500 }}>V</span>
        }
      </div>

      <div 
        className="max-w-[90%] sm:max-w-[75%]"
        style={{
        background: isUser ? 'var(--accent)' : 'var(--surface)',
        border: isUser ? 'none' : '1px solid var(--border)',
        borderRadius: isUser 
          ? '16px 4px 16px 16px' 
          : '4px 16px 16px 16px',
        padding: '12px 16px',
      }}>
        <p style={{
          fontSize: '15px',
          color: isUser ? 'white' : 'var(--text-primary)',
          lineHeight: 1.7,
          margin: 0,
          whiteSpace: 'pre-wrap'
        }}>
          {content}
        </p>
      </div>
    </motion.div>
  )
}
