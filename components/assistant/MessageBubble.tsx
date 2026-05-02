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
        background: isUser ? '#f1f3f5' : '#5b6ef5',
        border: '1px solid #e9ecef',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {isUser 
          ? <User size={14} color="#6b7280" />
          : <span style={{ fontSize: '14px', color: 'white', 
              fontWeight: 500 }}>V</span>
        }
      </div>

      <div 
        className="max-w-[90%] sm:max-w-[75%]"
        style={{
        background: isUser ? '#5b6ef5' : '#ffffff',
        border: isUser ? 'none' : '1px solid #e9ecef',
        borderRadius: isUser 
          ? '16px 4px 16px 16px' 
          : '4px 16px 16px 16px',
        padding: '12px 16px',
        boxShadow: isUser ? '0 4px 12px rgba(91, 110, 245, 0.2)' : 'none'
      }}>
        <p style={{
          fontSize: '15px',
          color: isUser ? 'white' : '#111118',
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
