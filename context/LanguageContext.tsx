'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'bn', name: 'Bengali' }
]

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'English',
  setLanguage: () => {}
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('English')

  useEffect(() => {
    const saved = localStorage.getItem('election_app_language')
    if (saved) {
      setLanguage(saved)
    }
    }, [])

    const changeLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem('election_app_language', lang)
    }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
