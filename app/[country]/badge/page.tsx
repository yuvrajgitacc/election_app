'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Share2, Download, ArrowLeft, Globe } from 'lucide-react'
import { countries } from '@/lib/countries'
import Navbar from '@/components/layout/Navbar'
import html2canvas from 'html2canvas'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { addXP, awardBadge } from '@/lib/xp'

export default function BadgePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [countryName, setCountryName] = useState('')
  const [countryFlag, setCountryFlag] = useState('')
  const [score, setScore] = useState(0)
  const [copied, setCopied] = useState(false)
  const [xpAwarded, setXpAwarded] = useState(false)
  const badgeRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  useEffect(() => {
    const slug = params.country as string
    const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    setCountryName(name)

    const c = countries.find(c => c.name.toLowerCase() === name.toLowerCase())
    if (c) setCountryFlag(c.flag)

    const s = parseInt(searchParams.get('score') || '0', 10)
    setScore(s)

    // Calculate badge title
    let title = ''
    if (s <= 3) title = 'Civic Newcomer'
    else if (s <= 5) title = 'Informed Voter'
    else if (s <= 7) title = 'Democracy Champion'
    else title = 'Election Expert'

    if (user && name) {
      awardBadge(user.uid, name, title)
    }

  }, [params.country, searchParams, user])

  let badgeTitle = ''
  let badgeColor = ''
  let badgeGradient = ''
  
  if (score <= 3) { 
    badgeTitle = 'Civic Newcomer'
    badgeColor = '#6b7280'
    badgeGradient = 'linear-gradient(135deg, #f3f4f6, #e5e7eb)'
  } else if (score <= 5) { 
    badgeTitle = 'Informed Voter'
    badgeColor = '#3b82f6'
    badgeGradient = 'linear-gradient(135deg, #dbeafe, #bfdbfe)'
  } else if (score <= 7) { 
    badgeTitle = 'Democracy Champion'
    badgeColor = '#10b981'
    badgeGradient = 'linear-gradient(135deg, #dcfce7, #bbf7d0)'
  } else { 
    badgeTitle = 'Election Expert'
    badgeColor = '#f59e0b'
    badgeGradient = 'linear-gradient(135deg, #fef3c7, #fde68a)'
  }

  const handleShare = async () => {
    const text = `I just scored ${score}/8 and earned the "${badgeTitle}" badge for ${countryName} elections on ElectionApp! 🗳️✨`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (!xpAwarded && user) {
        addXP(user.uid, 100, user.displayName || 'User', user.photoURL)
        setXpAwarded(true)
      }
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const handleDownload = async () => {
    if (!badgeRef.current) return
    try {
      const canvas = await html2canvas(badgeRef.current, { backgroundColor: '#ffffff', scale: 2 })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `ElectionApp_${countryName}_Badge.png`
      a.click()
      if (!xpAwarded && user) {
        addXP(user.uid, 100, user.displayName || 'User', user.photoURL)
        setXpAwarded(true)
      }
    } catch (err) {
      console.error('Failed to download image', err)
    }
  }

  if (!countryName) return null

  return (
    <ProtectedRoute>
      <main style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ paddingTop: '64px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 40px' }}>
          
          {/* Badge Card for Screenshot */}
          <div ref={badgeRef} style={{ background: '#ffffff', padding: '40px', borderRadius: '32px', border: '1px solid #e9ecef', textAlign: 'center', maxWidth: '400px', width: '100%', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
            
            {/* Animated Background Gradient */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: badgeGradient, opacity: 0.5, zIndex: 0 }} 
            />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* SVG Badge Shape */}
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: 'spring', damping: 15 }}
                style={{ width: '120px', height: '120px', margin: '0 auto 24px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%', filter: `drop-shadow(0 0 20px ${badgeColor}44)` }}>
                  <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="#ffffff" stroke={badgeColor} strokeWidth="4" />
                </svg>
                <span style={{ fontSize: '48px', zIndex: 2 }}>{countryFlag || '🌍'}</span>
              </motion.div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: badgeColor, marginBottom: '8px' }}>
                {badgeTitle}
              </h2>
              <p style={{ fontSize: '16px', color: '#111118', marginBottom: '16px', lineHeight: 1.5 }}>
                You have mastered elections in <strong>{countryName}</strong>
              </p>
              
              <div style={{ display: 'inline-block', background: '#f8f9fa', padding: '8px 24px', borderRadius: '100px', border: '1px solid #e9ecef' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Score: </span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#111118' }}>{score}/8</span>
              </div>
              
              <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', background: '#5b6ef5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>V</div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280' }}>ElectionApp</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '40px', width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleShare} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: '#5b6ef5', color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', transition: 'transform 0.1s' }}>
                <Share2 size={18} /> {copied ? 'Copied!' : 'Share Text'}
              </button>
              <button onClick={handleDownload} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: '#f1f3f5', color: '#111118', border: '1px solid #e9ecef', borderRadius: '14px', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
                <Download size={18} /> Save Image
              </button>
            </div>
            
            <button onClick={() => router.push(`/${params.country}/guide`)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: 'transparent', color: '#4b5563', border: '1px solid #e9ecef', borderRadius: '14px', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
              <ArrowLeft size={18} /> Back to Guide
            </button>
            
            <button onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: 'transparent', color: '#4b5563', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
              <Globe size={18} /> Try Another Country
            </button>
          </div>

        </div>
      </main>
    </ProtectedRoute>
  )
}
