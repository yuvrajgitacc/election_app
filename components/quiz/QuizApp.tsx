'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Timer from './Timer'
import ScoreScreen from './ScoreScreen'
import { useAuth } from '@/context/AuthContext'
import { addXP } from '@/lib/xp'

interface Question {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export default function QuizApp({ countryName, language }: { countryName: string, language: string }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const fetchQuestions = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryName, language })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions.slice(0, 8))
      } else {
        throw new Error('No questions generated')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (countryName) fetchQuestions()
  }, [countryName, language])

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return
    setSelectedOption(index)
    if (index === questions[currentIdx].correctIndex) {
      setScore(s => s + 1)
    }
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1)
        setSelectedOption(null)
      } else {
        const finalScore = index === questions[currentIdx].correctIndex ? score + 1 : score;
        if (finalScore === 8 && user) {
          addXP(user.uid, 200, user.displayName || 'User', user.photoURL)
        }
        window.location.href = `/${countryName.toLowerCase()}/badge?score=${finalScore}`
      }
    }, 2000)
  }

  const handleTimeUp = () => {
    if (selectedOption !== null) return
    handleAnswer(-1) // timeout
  }

  const handleRetry = () => {
    setQuestions([])
    setCurrentIdx(0)
    setSelectedOption(null)
    setScore(0)
    setShowScore(false)
    fetchQuestions()
  }

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '24px' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--text-secondary)' }}>Generating your quiz for {countryName}...</p>
    </div>
  )

  if (error) return (
    <div style={{ textAlign: 'center', padding: '40px', background: 'var(--surface)', borderRadius: '16px', maxWidth: '500px', margin: '100px auto' }}>
      <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
      <button onClick={fetchQuestions} style={{ padding: '10px 20px', background: 'var(--accent)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Retry</button>
    </div>
  )

  if (showScore) return <ScoreScreen score={score} total={questions.length} countryName={countryName} onRetry={handleRetry} />

  const question = questions[currentIdx]
  
  return (
    <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500, background: 'var(--surface)', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border)' }}>
          Question {currentIdx + 1} of {questions.length}
        </span>
        <Timer duration={30} onTimeUp={handleTimeUp} resetKey={currentIdx} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 32px)', marginBottom: '32px', lineHeight: 1.4, color: 'var(--text-primary)' }}>
            {question.question}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {question.options.map((opt, i) => {
              let bg = 'var(--surface)'
              let borderColor = 'var(--border)'
              if (selectedOption !== null) {
                if (i === question.correctIndex) {
                  bg = '#10b98122'; borderColor = '#10b981'
                } else if (i === selectedOption) {
                  bg = '#ef444422'; borderColor = '#ef4444'
                }
              }

              return (
                <motion.button
                  key={i}
                  whileHover={selectedOption === null ? { scale: 1.01, borderColor: 'var(--accent)' } : {}}
                  whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedOption !== null}
                  style={{ width: '100%', textAlign: 'left', padding: '16px 20px', background: bg, border: `2px solid ${borderColor}`, borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', cursor: selectedOption === null ? 'pointer' : 'default', transition: 'all 0.2s ease' }}
                >
                  {opt}
                </motion.button>
              )
            })}
          </div>

          <AnimatePresence>
            {selectedOption !== null && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '24px', padding: '16px', background: 'var(--surface-2)', borderRadius: '12px', borderLeft: '4px solid var(--accent)' }}>
                <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {selectedOption === question.correctIndex ? '✅ Correct! ' : '❌ Incorrect. '} 
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
