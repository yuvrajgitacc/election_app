'use client'
import { useEffect, useState } from 'react'

export default function Timer({ duration, onTimeUp, resetKey }: { duration: number, onTimeUp: () => void, resetKey: number }) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration, resetKey])

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const radius = 20
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (timeLeft / duration) * circumference

  return (
    <div style={{ position: 'relative', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="50" height="50" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
        <circle cx="25" cy="25" r={radius} fill="none" stroke="var(--surface-2)" strokeWidth="4" />
        <circle cx="25" cy="25" r={radius} fill="none" stroke={timeLeft <= 5 ? '#ef4444' : 'var(--accent)'} strokeWidth="4"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }} />
      </svg>
      <span style={{ fontSize: '14px', fontWeight: 'bold', color: timeLeft <= 5 ? '#ef4444' : 'var(--text-primary)' }}>{timeLeft}</span>
    </div>
  )
}
