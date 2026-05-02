'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import AssistantWindow from '@/components/assistant/AssistantWindow'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function GuidePage() {
  const params = useParams()
  const [countryName, setCountryName] = useState('')
  const [language, setLanguage] = useState('English')

  useEffect(() => {
    const slug = params.country as string
    const name = slug.split('-').map(
      (w: string) => w.charAt(0).toUpperCase() + w.slice(1)
    ).join(' ')
    setCountryName(name)

    const savedLang = localStorage.getItem('election_app_language') || 'English'
    setLanguage(savedLang)
  }, [params.country])

  if (!countryName) return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '32px', height: '32px',
        border: '2px solid var(--border)',
        borderTop: '2px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    </div>
  )

  return (
    <ProtectedRoute>
      <main style={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Navbar />
        <div style={{ paddingTop: '100px', paddingBottom: '40px', flex: 1, display: 'flex',
          flexDirection: 'column' }} className="px-[16px] sm:px-[24px]">
          <AssistantWindow 
            countryName={countryName} 
            language={language} 
          />
        </div>
      </main>
    </ProtectedRoute>
  )
}
