'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, ArrowLeft, RotateCcw } from 'lucide-react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import PathSelector from './PathSelector'
import ProgressBar from './ProgressBar'
import { useAuth } from '@/context/AuthContext'
import { addXP } from '@/lib/xp'
import { useLanguage } from '@/context/LanguageContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface Path {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  totalSteps: number
}

interface AssistantWindowProps {
  countryName: string
}

const SYSTEM_PROMPT = (country: string, language: string, pathId: string) => `
You are ElectionApp AI, a non-partisan civic education assistant.
The user wants to understand elections in ${country}.
Current topic: ${pathId}
Language: Respond in ${language}.

Rules:
- Be clear, friendly, and educational
- Keep responses concise — 2 to 4 paragraphs max
- Use simple language anyone can understand
- Never take political sides or mention specific candidates
- Always be specific to ${country}'s actual electoral system and laws
- End each response with one follow-up question the user 
  might want to explore next, formatted as:
  "💡 You might also want to know: [question]"
- If asked about registration, voting day, counting, or process,
  give real accurate information about ${country}
`

const STEP_PROMPTS: Record<string, string[]> = {
  registration: [
    'Who is eligible to vote in {country}? What are the basic requirements?',
    'How does voter registration work in {country}? What are the steps?',
    'What documents do I need to register as a voter in {country}?',
    'What is the deadline to register before an election in {country}?',
    'How can I check if I am registered to vote in {country}?'
  ],
  process: [
    'Give me an overview of how the election system works in {country}.',
    'How are candidates nominated for elections in {country}?',
    'What happens during the campaign period in {country}?',
    'How does {country} determine the winner of an election?',
    'What role does the election commission play in {country}?',
    'How does the transfer of power work after elections in {country}?'
  ],
  'voting-day': [
    'What happens on election day in {country}? Walk me through the process.',
    'Where do people go to vote in {country} and how do they find their polling station?',
    'What ID or documents do I need to bring to vote in {country}?',
    'How do I actually cast my vote in {country}? Paper or electronic?'
  ],
  counting: [
    'How are votes counted after polling closes in {country}?',
    'Who oversees the vote counting process in {country}?',
    'How long does it take to get official results in {country}?',
    'What happens if results are very close or disputed in {country}?'
  ]
}

export default function AssistantWindow({ 
  countryName 
}: AssistantWindowProps) {
  const { language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedPath, setSelectedPath] = useState<Path | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [showPathSelector, setShowPathSelector] = useState(true)
  const [xpAwarded, setXpAwarded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const { user } = useAuth()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const callGemini = async (userMessage: string, pathId: string) => {
    setIsTyping(true)
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT(countryName, language, pathId),
          userMessage,
          country: countryName,
          language
        })
      })
      const data = await response.json()
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.text
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please try again.'
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSelectPath = async (path: Path) => {
    setSelectedPath(path)
    setShowPathSelector(false)
    setCurrentStep(0)
    setMessages([])
    setXpAwarded(false)

    if (path.id === 'quiz') {
      window.location.href = `/${countryName.toLowerCase()}/quiz`
      return
    }

    if (path.id === 'custom') {
      const welcomeMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Hi! I'm your ElectionApp guide for elections in ${countryName}. Ask me anything about the election process, voter registration, voting day, or how results are counted. What would you like to know?`
      }
      setMessages([welcomeMsg])
      return
    }

    const steps = STEP_PROMPTS[path.id] || []
    if (steps.length > 0) {
      const firstQuestion = steps[0].replace(/{country}/g, countryName)
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `Tell me about: ${path.title} in ${countryName}`
      }
      setMessages([userMsg])
      setCurrentStep(1)
      await callGemini(firstQuestion, path.id)
    }
  }

  const handleNextStep = async () => {
    if (!selectedPath) return
    const steps = STEP_PROMPTS[selectedPath.id] || []
    const nextStepIndex = currentStep

    if (nextStepIndex < steps.length) {
      const question = steps[nextStepIndex].replace(/{country}/g, countryName)
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: question
      }
      setMessages(prev => [...prev, userMsg])
      setCurrentStep(prev => prev + 1)
      
      // Award XP if this is the final step
      if (nextStepIndex + 1 >= steps.length && !xpAwarded && user) {
        addXP(user.uid, 50, user.displayName || 'User', user.photoURL)
        setXpAwarded(true)
      }

      await callGemini(question, selectedPath.id)
    }
  }

  const handleSendMessage = async () => {
    const msg = inputValue.trim()
    if (!msg || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msg
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    await callGemini(msg, selectedPath?.id || 'custom')
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 
          'SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser.')
      return
    }
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    const SR = (window as any).SpeechRecognition || 
               (window as any).webkitSpeechRecognition
    const recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputValue(transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  const hasMoreSteps = selectedPath && 
    selectedPath.id !== 'custom' &&
    currentStep < (STEP_PROMPTS[selectedPath.id]?.length || 0)

  return (
    <div className="px-2 sm:px-4" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: showPathSelector ? 'auto' : 'calc(100vh - 64px)',
      height: showPathSelector ? 'auto' : 'calc(100vh - 64px)',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%'
    }}>

      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 0',
        borderBottom: '1px solid #e9ecef'
      }}>
        {!showPathSelector && (
          <button
            onClick={() => {
              setShowPathSelector(true)
              setSelectedPath(null)
              setMessages([])
              setCurrentStep(0)
            }}
            style={{
              display: 'flex', alignItems: 'center',
              gap: '6px', background: 'none',
              border: '1px solid #e9ecef',
              borderRadius: '8px', padding: '6px 12px',
              color: '#4b5563',
              fontSize: '13px', cursor: 'pointer'
            }}
          >
            <ArrowLeft size={14} />
            Back
          </button>
        )}
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '14px', fontWeight: 500,
            color: '#111118', margin: 0
          }}>
            {showPathSelector 
              ? `Elections in ${countryName}`
              : selectedPath?.title
            }
          </p>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0
          }}>
            {countryName} · ElectionApp AI
          </p>
        </div>
        {!showPathSelector && (
          <button
            onClick={() => {
              setMessages([])
              setCurrentStep(0)
              if (selectedPath) handleSelectPath(selectedPath)
            }}
            style={{
              display: 'flex', alignItems: 'center',
              gap: '6px', background: 'none',
              border: '1px solid #e9ecef',
              borderRadius: '8px', padding: '6px 12px',
              color: '#4b5563',
              fontSize: '13px', cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} />
            Restart
          </button>
        )}
      </div>

      {/* Progress bar */}
      {selectedPath && !showPathSelector && 
       selectedPath.id !== 'custom' && (
        <ProgressBar
          currentStep={currentStep}
          totalSteps={selectedPath.totalSteps}
          pathTitle={selectedPath.title}
        />
      )}

      {/* Main content area */}
      <div style={{
        flex: 1,
        overflowY: showPathSelector ? 'visible' : 'auto',
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <AnimatePresence mode="wait">
          {showPathSelector ? (
            <motion.div
              key="path-selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ 
                flex: 1, display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px'
              }}
            >
              <PathSelector
                countryName={countryName}
                onSelectPath={handleSelectPath}
              />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {messages.map(message => (
                <MessageBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  countryName={countryName}
                />
              ))}
              {isTyping && <TypingIndicator />}
              
              {/* Next step button */}
              {hasMoreSteps && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '16px'
                  }}
                >
                  <button
                    onClick={handleNextStep}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--accent)',
                      borderRadius: '10px',
                      padding: '10px 20px',
                      color: 'var(--accent)',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    Continue to next step →
                  </button>
                </motion.div>
              )}

              {/* Completed message */}
              {selectedPath && 
               selectedPath.id !== 'custom' &&
               currentStep >= selectedPath.totalSteps && 
               !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    textAlign: 'center',
                    padding: '24px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    marginTop: '16px'
                  }}
                >
                  <p style={{
                    fontSize: '20px',
                    marginBottom: '8px'
                  }}>
                    🎉
                  </p>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    marginBottom: '6px'
                  }}>
                    Topic complete!
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginBottom: '16px'
                  }}>
                    You have learned about {selectedPath.title} 
                    in {countryName}.
                  </p>
                  <button
                    onClick={() => {
                      setShowPathSelector(true)
                      setSelectedPath(null)
                      setMessages([])
                      setCurrentStep(0)
                    }}
                    style={{
                      background: 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 20px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Explore another topic
                  </button>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area — only show when not on path selector */}
      {!showPathSelector && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '16px 0',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder={`Ask anything about elections in ${countryName}...`}
              disabled={isTyping}
              style={{
                width: '100%',
                height: '48px',
                background: '#ffffff',
                border: '1px solid #e9ecef',
                borderRadius: '12px',
                padding: '0 16px',
                fontSize: '15px',
                color: '#111118',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={handleVoiceInput}
            style={{
              width: '48px', height: '48px',
              borderRadius: '12px',
              background: isListening 
                ? 'var(--accent)' 
                : '#f8f9fa',
              border: '1px solid #e9ecef',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              color: isListening 
                ? 'white' 
                : '#6b7280'
            }}
          >
            {isListening 
              ? <MicOff size={18} /> 
              : <Mic size={18} />
            }
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            style={{
              width: '48px', height: '48px',
              borderRadius: '12px',
              background: inputValue.trim() && !isTyping
                ? 'var(--accent)' 
                : '#f8f9fa',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputValue.trim() && !isTyping
                ? 'pointer' 
                : 'not-allowed',
              flexShrink: 0,
              transition: 'background 0.2s ease'
            }}
          >
            <Send 
              size={18} 
              color={inputValue.trim() && !isTyping
                ? 'white' 
                : '#9ca3af'
              } 
            />
          </button>
        </div>
      )}
    </div>
  )
}
