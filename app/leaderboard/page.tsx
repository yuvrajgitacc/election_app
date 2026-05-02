'use client'

import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { Trophy, Medal, Star, ArrowLeft } from 'lucide-react'
import { db } from '@/lib/firebase'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import Image from 'next/image'

interface LeaderboardUser {
  id: string
  displayName: string
  photoURL: string | null
  xp: number
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(50))
        const snapshot = await getDocs(q)
        const fetchedUsers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as LeaderboardUser[]
        setUsers(fetchedUsers)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ paddingTop: '100px', paddingBottom: '60px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9090a8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
              <ArrowLeft size={16} /> Home
            </Link>
          </div>

          <div style={{ textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              style={{
                width: '64px', height: '64px', background: 'rgba(91, 110, 245, 0.1)', border: '1px solid rgba(91, 110, 245, 0.3)',
                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
              }}
            >
              <Trophy size={32} color="#5b6ef5" />
            </motion.div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', color: '#f0f0f5', marginBottom: '8px', lineHeight: 1.1 }}>
              Civic Leaderboard
            </h1>
            <p style={{ color: '#9090a8', fontSize: '15px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto' }}>
              Top contributors who have mastered their country's election processes and earned the most Civic XP.
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid #1e1e2e', borderTop: '3px solid #5b6ef5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
                    background: index === 0 ? 'rgba(251, 191, 36, 0.05)' : index === 1 ? 'rgba(156, 163, 175, 0.05)' : index === 2 ? 'rgba(180, 83, 9, 0.05)' : '#111118',
                    border: `1px solid ${index === 0 ? 'rgba(251, 191, 36, 0.3)' : index === 1 ? 'rgba(156, 163, 175, 0.3)' : index === 2 ? 'rgba(180, 83, 9, 0.3)' : '#1e1e2e'}`,
                    borderRadius: '16px'
                  }}
                >
                  <div style={{ width: '32px', display: 'flex', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#b45309' : '#55556a' }}>
                    {index + 1}
                  </div>
                  
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt={user.displayName} width={40} height={40} style={{ borderRadius: '50%', border: index < 3 ? `2px solid ${index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : '#b45309'}` : '1px solid #1e1e2e' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1a1a28', border: index < 3 ? `2px solid ${index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : '#b45309'}` : '1px solid #1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0f0f5', fontWeight: 500, fontSize: '16px' }}>
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '16px', fontWeight: 500, color: '#f0f0f5' }}>
                      {user.displayName || 'Anonymous Citizen'}
                    </span>
                    {index === 0 && <span style={{ fontSize: '12px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}><Medal size={12} /> Democracy Champion</span>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(91, 110, 245, 0.1)', padding: '6px 12px', borderRadius: '100px' }}>
                    <Star size={14} color="#5b6ef5" />
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#5b6ef5' }}>{user.xp} XP</span>
                  </div>
                </motion.div>
              ))}

              {users.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9090a8' }}>
                  No leaders yet. Start learning to claim the #1 spot!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
