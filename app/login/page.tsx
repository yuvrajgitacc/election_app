'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  ConfirmationResult
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [showOtp, setShowOtp] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && user) {
      const savedCountry = localStorage.getItem('election_app_country_name')
      if (savedCountry) {
        const slug = savedCountry.toLowerCase().split(' ').join('-')
        router.push(`/${slug}/guide`)
      } else {
        router.push('/')
      }
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      })
    }
  }, [])

  const getFirebaseErrorMessage = (errCode: string) => {
    switch (errCode) {
      case 'auth/user-not-found': return 'No account found with this email'
      case 'auth/wrong-password': return 'Incorrect password'
      case 'auth/email-already-in-use': return 'Email already registered. Sign in instead.'
      case 'auth/weak-password': return 'Password must be at least 6 characters'
      case 'auth/invalid-email': return 'Please enter a valid email'
      case 'auth/invalid-verification-code': return 'Invalid OTP code'
      default: return 'An error occurred. Please try again.'
    }
  }

  const handleGoogleAuth = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code))
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      if (activeTab === 'signup') {
        if (password !== confirmPassword) {
          throw { code: 'auth/password-mismatch', message: 'Passwords do not match' }
        }
        const userCred = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(userCred.user, { displayName: name })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code) || err.message)
      setLoading(false)
    }
  }

  const handleSendOtp = async () => {
    setError('')
    setLoading(true)
    try {
      const appVerifier = window.recaptchaVerifier
      const fullPhone = phone.startsWith('+') ? phone : `+91${phone}`
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, appVerifier)
      setConfirmationResult(confirmation)
      setShowOtp(true)
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code) || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!confirmationResult) return
    setError('')
    setLoading(true)
    try {
      const code = otp.join('')
      await confirmationResult.confirm(code)
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code))
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const getPasswordStrength = (pass: string) => {
    let score = 0
    if (pass.length > 5) score += 1
    if (pass.length > 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    return score
  }

  const passStrength = getPasswordStrength(password)

  if (authLoading || user) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>{`
        @media (min-width: 768px) {
          .auth-container { flex-direction: row !important; }
          .auth-left { width: 60% !important; padding: 64px !important; }
          .auth-right { width: 40% !important; display: flex !important; align-items: center !important; justify-content: center !important; }
        }
      `}</style>

      <div className="auth-container" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Left Side Hero */}
        <div className="auth-left" style={{
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Grid background */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            pointerEvents: 'none', zIndex: 0
          }} />

          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            textDecoration: 'none', position: 'relative', zIndex: 1
          }}>
            <div style={{
              width: '28px', height: '28px', background: '#5b6ef5',
              borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '16px' }}>V</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '20px', color: '#f0f0f5' }}>Voter</span>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '20px', color: '#5b6ef5' }}>Lens</span>
            </div>
          </Link>

          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', position: 'relative', zIndex: 1,
            marginTop: '60px', marginBottom: '40px'
          }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 64px)',
              color: '#f0f0f5',
              lineHeight: 1.1,
              marginBottom: '20px',
              maxWidth: '600px'
            }}>
              Your vote.<br />
              <span style={{ color: '#5b6ef5' }}>Your voice.</span><br />
              Understand it.
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#9090a8',
              maxWidth: '400px',
              lineHeight: 1.6
            }}>
              Sign in to access your personalized election guide, track your progress, and earn civic badges.
            </p>
          </div>
        </div>

        {/* Right Side Auth Card */}
        <div className="auth-right" style={{ padding: '0 24px 40px' }}>
          <div style={{
            width: '100%',
            maxWidth: '440px',
            background: '#111118',
            border: '1px solid #1e1e2e',
            borderRadius: '20px',
            padding: '40px',
            position: 'relative'
          }}>
            
            {/* Tabs */}
            <div style={{
              display: 'flex', gap: '24px', borderBottom: '1px solid #1e1e2e',
              marginBottom: '32px', position: 'relative'
            }}>
              {(['signin', 'signup'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setError(''); setAuthMethod('email'); }}
                  style={{
                    padding: '0 0 12px',
                    background: 'none', border: 'none',
                    color: activeTab === tab ? '#f0f0f5' : '#9090a8',
                    fontSize: '16px', fontWeight: 500, cursor: 'pointer',
                    position: 'relative', transition: 'color 0.2s ease'
                  }}
                >
                  {tab === 'signin' ? 'Sign in' : 'Sign up'}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-underline"
                      style={{
                        position: 'absolute', bottom: -1, left: 0, right: 0,
                        height: '2px', background: '#5b6ef5'
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444', padding: '12px 16px', borderRadius: '10px',
                fontSize: '13px', marginBottom: '24px'
              }}>
                {error}
              </div>
            )}

            {/* Google Auth */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleAuth}
              style={{
                width: '100%', height: '48px', background: 'white', color: 'black',
                border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '12px', fontSize: '15px', fontWeight: 500, cursor: 'pointer',
                marginBottom: '24px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </motion.button>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#1e1e2e' }} />
              <span style={{ fontSize: '13px', color: '#9090a8' }}>
                or continue with {authMethod === 'email' ? 'email' : 'phone'}
              </span>
              <div style={{ flex: 1, height: '1px', background: '#1e1e2e' }} />
            </div>

            {authMethod === 'email' ? (
              <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeTab === 'signup' && (
                  <input
                    type="text" required placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
                    style={{
                      width: '100%', height: '48px', background: '#0a0a0f', border: '1px solid #1e1e2e',
                      borderRadius: '12px', padding: '0 16px', color: '#f0f0f5', fontSize: '15px', outline: 'none', boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = '#5b6ef5'}
                    onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                  />
                )}
                
                <input
                  type="email" required placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%', height: '48px', background: '#0a0a0f', border: '1px solid #1e1e2e',
                    borderRadius: '12px', padding: '0 16px', color: '#f0f0f5', fontSize: '15px', outline: 'none', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#5b6ef5'}
                  onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                />

                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'} required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                    style={{
                      width: '100%', height: '48px', background: '#0a0a0f', border: '1px solid #1e1e2e',
                      borderRadius: '12px', padding: '0 48px 0 16px', color: '#f0f0f5', fontSize: '15px', outline: 'none', boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = '#5b6ef5'}
                    onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                    position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#9090a8', cursor: 'pointer', padding: 0
                  }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {activeTab === 'signup' && (
                  <>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '-8px', marginBottom: '8px' }}>
                      {[1, 2, 3, 4].map(level => (
                        <div key={level} style={{
                          height: '4px', flex: 1, borderRadius: '2px', transition: 'background 0.3s ease',
                          background: password.length === 0 ? '#1e1e2e' 
                            : passStrength >= level 
                              ? (passStrength === 1 ? '#ef4444' : passStrength === 2 ? '#f97316' : passStrength === 3 ? '#eab308' : '#22c55e')
                              : '#1e1e2e'
                        }} />
                      ))}
                    </div>
                    
                    <input
                      type="password" required placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%', height: '48px', background: '#0a0a0f', border: '1px solid #1e1e2e',
                        borderRadius: '12px', padding: '0 16px', color: '#f0f0f5', fontSize: '15px', outline: 'none', boxSizing: 'border-box'
                      }}
                      onFocus={e => e.target.style.borderColor = '#5b6ef5'}
                      onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                    />
                  </>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" disabled={loading}
                  style={{
                    width: '100%', height: '48px', background: '#5b6ef5', color: 'white',
                    border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '15px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: '8px'
                  }}
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : (activeTab === 'signin' ? 'Sign in' : 'Create account')}
                </motion.button>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button type="button" onClick={() => setAuthMethod('phone')} style={{
                    background: 'transparent', border: '1px solid #1e1e2e', color: '#f0f0f5',
                    padding: '10px 20px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer',
                    transition: 'border-color 0.2s ease'
                  }} onMouseOver={e => e.currentTarget.style.borderColor = '#5b6ef5'} onMouseOut={e => e.currentTarget.style.borderColor = '#1e1e2e'}>
                    Continue with Phone
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {!showOtp ? (
                  <>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text" value="+91" disabled
                        style={{
                          width: '60px', height: '48px', background: '#0a0a0f', border: '1px solid #1e1e2e',
                          borderRadius: '12px', color: '#9090a8', fontSize: '15px', textAlign: 'center', outline: 'none'
                        }}
                      />
                      <input
                        type="tel" placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)}
                        style={{
                          flex: 1, height: '48px', background: '#0a0a0f', border: '1px solid #1e1e2e',
                          borderRadius: '12px', padding: '0 16px', color: '#f0f0f5', fontSize: '15px', outline: 'none'
                        }}
                        onFocus={e => e.target.style.borderColor = '#5b6ef5'}
                        onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendOtp} disabled={loading || phone.length < 10}
                      style={{
                        width: '100%', height: '48px', background: '#5b6ef5', color: 'white',
                        border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '15px', fontWeight: 500, cursor: loading || phone.length < 10 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : 'Send OTP'}
                    </motion.button>
                  </>
                ) : (
                  <>
                    <p style={{ color: '#9090a8', fontSize: '14px', textAlign: 'center', margin: '0 0 8px' }}>
                      Enter 6-digit code sent to {phone}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      {otp.map((digit, i) => (
                        <input
                          key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit} onChange={e => handleOtpChange(i, e.target.value)}
                          style={{
                            width: '40px', height: '48px', background: '#0a0a0f', border: '1px solid #1e1e2e',
                            borderRadius: '10px', color: '#f0f0f5', fontSize: '20px', textAlign: 'center', outline: 'none'
                          }}
                          onFocus={e => e.target.style.borderColor = '#5b6ef5'}
                          onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                        />
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleVerifyOtp} disabled={loading || otp.join('').length !== 6}
                      style={{
                        width: '100%', height: '48px', background: '#5b6ef5', color: 'white',
                        border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '15px', fontWeight: 500, cursor: loading || otp.join('').length !== 6 ? 'not-allowed' : 'pointer',
                        marginTop: '16px'
                      }}
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : 'Verify OTP'}
                    </motion.button>
                  </>
                )}
                
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button type="button" onClick={() => setAuthMethod('email')} style={{
                    background: 'none', border: 'none', color: '#9090a8', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline'
                  }}>
                    Back to email
                  </button>
                </div>
              </div>
            )}
            
            <div id="recaptcha-container"></div>
          </div>
        </div>

      </div>
    </div>
  )
}
