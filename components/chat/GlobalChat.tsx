'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Loader2, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function GlobalChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: 'Hi! I am VoterBot 🤖 Ask me anything about elections, voter registration, or voting laws around the world!'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!input.trim()) return

    if (!user) {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'user', content: input },
        { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Please sign in to continue chatting with VoterBot! 🔒' }
      ])
      setInput('')
      return
    }

    const userMessageText = input
    const newMessage: Message = { id: Date.now().toString(), role: 'user', content: userMessageText }
    
    setMessages(prev => [...prev, newMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: "You are VoterBot, a highly knowledgeable global election assistant. Answer questions about voting, elections, and civic rights accurately. Keep answers concise, helpful, and friendly. If a specific country is not mentioned, give a general answer but remind them that rules vary by country.",
          userMessage: userMessageText,
          country: 'Global',
          language: 'English'
        })
      })

      const data = await res.json()
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.error ? "Oops, I'm having trouble connecting right now." : data.text
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, an error occurred while fetching the answer."
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '32px', right: '32px', zIndex: 100,
          width: '64px', height: '64px', borderRadius: '32px',
          background: 'var(--accent)', color: 'white', border: 'none',
          boxShadow: '0 8px 32px rgba(91, 110, 245, 0.4)',
          display: isOpen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <MessageSquare size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'fixed', bottom: '32px', right: '32px', zIndex: 100,
              width: '380px', height: '600px', maxHeight: '80vh',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '24px', display: 'flex', flexDirection: 'column',
              boxShadow: '0 24px 48px rgba(0,0,0,0.5)', overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>VoterBot</h3>
                  <span style={{ fontSize: '12px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} /> Online
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%', display: 'flex', flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '4px'
                  }}
                >
                  <div style={{
                    padding: '12px 16px',
                    background: msg.role === 'user' ? 'var(--accent)' : 'var(--background)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    fontSize: '14px', lineHeight: 1.5
                  }}>
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && msg.content.includes('Please sign in') && (
                    <button 
                      onClick={() => { setIsOpen(false); router.push('/login'); }}
                      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer', marginTop: '4px' }}
                    >
                      Go to Sign In
                    </button>
                  )}
                </motion.div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', background: 'var(--background)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '16px 16px 16px 4px' }}>
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '16px', background: 'var(--surface-2)', borderTop: '1px solid var(--border)' }}>
              <form 
                onSubmit={e => { e.preventDefault(); handleSend(); }}
                style={{ display: 'flex', gap: '8px' }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  style={{
                    flex: 1, background: 'var(--background)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '0 16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  style={{
                    width: '48px', height: '48px', background: 'var(--accent)', border: 'none',
                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', opacity: loading || !input.trim() ? 0.7 : 1
                  }}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
