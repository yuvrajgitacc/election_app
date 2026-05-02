'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { Trophy, Medal, Star, ArrowLeft, LogOut, Award, ShieldCheck } from 'lucide-react'
import { db, auth } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import Image from 'next/image'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

interface UserBadge {
  country: string
  badgeName: string
  date: string
}

interface UserProfile {
  xp: number
  badges: UserBadge[]
  displayName: string
  photoURL: string | null
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      try {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile)
        } else {
          setProfile({ xp: 0, badges: [], displayName: user.displayName || 'User', photoURL: user.photoURL })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleSignOut = async () => {
    await signOut(auth)
    router.push('/login')
  }

  const getRank = (xp: number) => {
    if (xp >= 1000) return 'Democracy Champion'
    if (xp >= 500) return 'Election Expert'
    if (xp >= 200) return 'Informed Voter'
    return 'Civic Newcomer'
  }

  const getBadgeColor = (badgeName: string) => {
    if (badgeName.includes('Newcomer')) return '#9090a8'
    if (badgeName.includes('Informed')) return '#3b82f6'
    if (badgeName.includes('Champion')) return '#10b981'
    return '#fbbf24'
  }

  return (
    <ProtectedRoute>
      <main style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        
        <div style={{ paddingTop: '100px', paddingBottom: '60px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '24px', paddingRight: '24px' }}>
          <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9090a8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                <ArrowLeft size={16} /> Home
              </Link>
              <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#ef4444', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                <LogOut size={16} /> Sign out
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <div style={{ width: '32px', height: '32px', border: '3px solid #1e1e2e', borderTop: '3px solid #5b6ef5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* ID Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'linear-gradient(135deg, #111118 0%, #1a1a28 100%)',
                    border: '1px solid #1e1e2e',
                    borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: '#5b6ef5', opacity: 0.05, borderRadius: '50%', filter: 'blur(40px)', transform: 'translate(30%, -30%)' }} />
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', position: 'relative', zIndex: 1 }}>
                    {user?.photoURL ? (
                      <Image src={user.photoURL} alt="Profile" width={80} height={80} style={{ borderRadius: '20px', border: '2px solid #2a2a3e' }} />
                    ) : (
                      <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: '#1e1e2e', border: '2px solid #2a2a3e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0f0f5', fontSize: '32px', fontWeight: 'bold' }}>
                        {user?.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#f0f0f5', margin: 0 }}>
                          {user?.displayName || 'Citizen'}
                        </h1>
                        <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={14} /> Verified
                        </div>
                      </div>
                      <p style={{ color: '#9090a8', margin: '0 0 16px 0', fontSize: '15px' }}>Digital ElectionApp ID</p>
                      
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Star size={20} color="#5b6ef5" />
                          <div>
                            <div style={{ fontSize: '12px', color: '#9090a8', textTransform: 'uppercase', letterSpacing: '1px' }}>Civic XP</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f0f0f5' }}>{profile?.xp || 0}</div>
                          </div>
                        </div>
                        
                        <div style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Medal size={20} color="#fbbf24" />
                          <div>
                            <div style={{ fontSize: '12px', color: '#9090a8', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Rank</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f0f0f5' }}>{getRank(profile?.xp || 0)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Trophy Cabinet */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trophy size={20} color="#fbbf24" />
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#f0f0f5', margin: 0 }}>Trophy Cabinet</h2>
                  </div>

                  {(!profile?.badges || profile.badges.length === 0) ? (
                    <div style={{ background: '#111118', border: '1px dashed #1e1e2e', borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
                      <Award size={48} color="#2a2a3e" style={{ margin: '0 auto 16px' }} />
                      <h3 style={{ fontSize: '18px', color: '#f0f0f5', margin: '0 0 8px' }}>No badges yet</h3>
                      <p style={{ color: '#9090a8', fontSize: '15px', maxWidth: '300px', margin: '0 auto 24px' }}>Complete country guides and score well on quizzes to earn your first civic badge.</p>
                      <Link href="/#country-picker" style={{ display: 'inline-flex', background: '#5b6ef5', color: 'white', textDecoration: 'none', padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 500 }}>
                        Explore Guides
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                      {profile.badges.map((badge, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          style={{
                            background: '#111118', border: '1px solid #1e1e2e', borderRadius: '20px',
                            padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                            position: 'relative', overflow: 'hidden'
                          }}
                        >
                          <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle, ${getBadgeColor(badge.badgeName)}15 0%, transparent 50%)`, zIndex: 0 }} />
                          <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', filter: `drop-shadow(0 0 10px ${getBadgeColor(badge.badgeName)}40)` }}>
                              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                                <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="#1e1e2e" stroke={getBadgeColor(badge.badgeName)} strokeWidth="6" />
                              </svg>
                            </div>
                            <h4 style={{ color: '#f0f0f5', fontSize: '16px', margin: '0 0 4px', fontWeight: 'bold' }}>{badge.badgeName}</h4>
                            <p style={{ color: '#9090a8', fontSize: '13px', margin: 0 }}>{badge.country}</p>
                            <p style={{ color: '#55556a', fontSize: '11px', marginTop: '12px', margin: '12px 0 0' }}>{new Date(badge.date).toLocaleDateString()}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
