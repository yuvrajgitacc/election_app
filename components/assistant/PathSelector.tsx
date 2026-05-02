'use client'

import { motion } from 'framer-motion'
import {
  FileText, MapPin, CheckSquare,
  BarChart2, HelpCircle, ArrowRight, Trophy, Shield
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Path {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  totalSteps: number
}

interface PathSelectorProps {
  countryName: string
  onSelectPath: (path: Path) => void
}

const PATHS = [
  {
    id: 'registration',
    title: 'Voter registration',
    description: 'How to register and who can vote',
    icon: <FileText size={18} />,
    totalSteps: 5
  },
  {
    id: 'process',
    title: 'Election process',
    description: 'How the full election works step by step',
    icon: <BarChart2 size={18} />,
    totalSteps: 6
  },
  {
    id: 'voting-day',
    title: 'Voting day',
    description: 'What happens when you go to vote',
    icon: <CheckSquare size={18} />,
    totalSteps: 4
  },
  {
    id: 'counting',
    title: 'Vote counting',
    description: 'How votes are counted and results declared',
    icon: <MapPin size={18} />,
    totalSteps: 4
  },
  {
    id: 'custom',
    title: 'Ask your own question',
    description: 'Type anything about elections in your country',
    icon: <HelpCircle size={18} />,
    totalSteps: 0
  },
  {
    id: 'verify',
    title: 'Fact Checker',
    description: 'Verify WhatsApp forwards and claims',
    icon: <Shield size={18} />,
    totalSteps: 0
  },
  {
    id: 'quiz',
    title: 'Take the Quiz',
    description: 'Test your knowledge and earn a badge',
    icon: <Trophy size={18} />,
    totalSteps: 0
  }
]

export default function PathSelector({
  countryName,
  onSelectPath
}: PathSelectorProps) {
  const router = useRouter()

  const handleClick = (path: typeof PATHS[0]) => {
    const slug = countryName.toLowerCase().split(' ').join('-')
    if (path.id === 'quiz') {
      router.push(`/${slug}/quiz`)
      return
    }
    if (path.id === 'verify') {
      router.push(`/${slug}/verify`)
      return
    }
    onSelectPath(path)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '0 16px'
      }}
    >
      {/* Header */}
      <div style={{
        marginBottom: '28px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 4vw, 32px)',
          color: '#f0f0f5',
          marginBottom: '8px',
          lineHeight: 1.2
        }}>
          Elections in {countryName}
        </h2>
        <p style={{
          fontSize: '15px',
          color: '#9090a8',
          lineHeight: 1.6
        }}>
          What would you like to understand?
        </p>
      </div>

      {/* Path cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {PATHS.map((path, i) => (
          <motion.button
            key={path.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: i * 0.07,
              type: 'spring',
              stiffness: 100
            }}
            whileHover={{
              x: 4,
              borderColor: '#5b6ef5',
              transition: { duration: 0.15 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleClick(path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            {/* Icon box */}
            <div style={{
              width: '36px',
              height: '36px',
              minWidth: '36px',
              borderRadius: '10px',
              background: '#1a1a28',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5b6ef5',
            }}>
              {path.icon}
            </div>

            {/* Text */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <span style={{
                fontSize: '15px',
                fontWeight: 500,
                color: '#f0f0f5',
                lineHeight: 1.3
              }}>
                {path.title}
              </span>
              <span style={{
                fontSize: '13px',
                color: '#9090a8',
                lineHeight: 1.4
              }}>
                {path.description}
              </span>
            </div>

            {/* Arrow */}
            <ArrowRight
              size={15}
              color="#55556a"
              style={{ flexShrink: 0 }}
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}