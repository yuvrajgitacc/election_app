'use client'
import { motion } from 'framer-motion'
import { Trophy, RefreshCcw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function ScoreScreen({ score, total, countryName, onRetry }: { score: number, total: number, countryName: string, onRetry: () => void }) {
  useEffect(() => {
    if (score === total) {
      const duration = 3 * 1000
      const end = Date.now() + duration
      const frame = () => {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#5b6ef5', '#f0f0f5', '#f97316'] })
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#5b6ef5', '#f0f0f5', '#f97316'] })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }
  }, [score, total])

  let badge = ''
  let badgeColor = ''
  if (score <= 3) { badge = 'Civic Newcomer'; badgeColor = '#9090a8' }
  else if (score <= 5) { badge = 'Informed Voter'; badgeColor = '#3b82f6' }
  else if (score <= 7) { badge = 'Democracy Champion'; badgeColor = '#10b981' }
  else { badge = 'Election Expert'; badgeColor = '#fbbf24' }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: '600px', width: '100%', margin: '0 auto', textAlign: 'center', padding: '40px 24px', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)' }}>
      <motion.div animate={score === total ? { y: [0, -10, 0] } : {}} transition={{ repeat: Infinity, duration: 2 }} style={{ width: '80px', height: '80px', margin: '0 auto 24px', background: badgeColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: score === total ? `0 0 40px ${badgeColor}66` : 'none' }}>
        <Trophy size={40} color={score === total ? '#fff' : 'var(--background)'} />
      </motion.div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '8px' }}>{badge}</h2>
      <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>You scored {score} out of {total} on the {countryName} election quiz.</p>
      
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={onRetry} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
          <RefreshCcw size={18} /> Try Another
        </button>
        <Link href={`/${countryName.toLowerCase()}/guide`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '12px', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
          <ArrowLeft size={18} /> Back to Guide
        </Link>
      </div>
    </motion.div>
  )
}
