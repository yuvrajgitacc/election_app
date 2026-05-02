'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShieldAlert, ShieldCheck, Shield, Loader2, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function VerifyPage() {
  const params = useParams()
  const router = useRouter()
  const countryName = (params.country as string)
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    status: 'True' | 'Misleading' | 'Fake News',
    explanation: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    if (!message.trim()) return
    setLoading(true)
    setResult(null)
    
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryName, message })
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else if (data.status) {
        setResult(data)
      }
    } catch (err: any) {
      console.error(err)
      setError('An unexpected error occurred while verifying.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'True': return '#22c55e'
      case 'Misleading': return '#eab308'
      case 'Fake News': return '#ef4444'
      default: return '#5b6ef5'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'True': return <ShieldCheck size={32} color="#22c55e" />
      case 'Misleading': return <ShieldAlert size={32} color="#eab308" />
      case 'Fake News': return <ShieldAlert size={32} color="#ef4444" />
      default: return <Shield size={32} color="#5b6ef5" />
    }
  }

  return (
    <ProtectedRoute>
      <main style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ paddingTop: '100px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 24px 40px' }}>
          
          <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <button 
              onClick={() => router.push(`/${params.country}/guide`)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px', width: 'fit-content', padding: 0 }}
            >
              <ArrowLeft size={16} /> Back to Guide
            </button>

            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: '#111118', marginBottom: '8px' }}>
                Fact Checker
              </h1>
              <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: 1.6 }}>
                Paste any forwarded message, political claim, or news snippet about {countryName}'s elections. ElectionApp AI will instantly verify it.
              </p>
            </div>

            <div style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Paste the suspicious message here..."
                style={{
                  width: '100%', minHeight: '160px', background: '#ffffff', border: '1px solid #e9ecef',
                  borderRadius: '12px', padding: '16px', color: '#111118', fontSize: '15px', resize: 'vertical',
                  outline: 'none', fontFamily: 'var(--font-body)', lineHeight: 1.5
                }}
                onFocus={e => e.target.style.borderColor = '#5b6ef5'}
                onBlur={e => e.target.style.borderColor = '#e9ecef'}
              />
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerify}
                disabled={loading || !message.trim()}
                style={{
                  width: '100%', height: '52px', background: '#5b6ef5', color: 'white',
                  border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px', fontSize: '16px', fontWeight: 500,
                  cursor: loading || !message.trim() ? 'not-allowed' : 'pointer', opacity: loading || !message.trim() ? 0.7 : 1
                }}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
                {loading ? 'Verifying...' : 'Verify Fact'}
              </motion.button>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '12px', fontSize: '15px' }}>
                {error}
              </div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#f8f9fa', border: `1px solid ${getStatusColor(result.status)}`,
                  borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
                  position: 'relative', overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: getStatusColor(result.status) }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getStatusIcon(result.status)}
                  <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: getStatusColor(result.status), margin: 0 }}>
                    {result.status}
                  </h3>
                </div>
                
                <p style={{ color: '#111118', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                  {result.explanation}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
