'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ChevronDown, Menu, X, User as UserIcon, Trophy, LogOut, Globe } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);



  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        transition: 'background 0.3s ease, border-bottom 0.3s ease',
        background: scrolled ? '#111118' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none'
      }}>
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
        <Link href="/" className="flex items-center gap-[10px]">
          <div className="w-[28px] h-[28px] bg-[#5b6ef5] rounded-[6px] flex items-center justify-center">
            <span className="text-white font-display italic text-[16px]">V</span>
          </div>
          <div className="flex items-center">
            <span className="font-display italic text-[20px] text-[#f0f0f5]">Voter</span>
            <span className="font-body font-light text-[20px] text-[#5b6ef5]">Lens</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => { setShowLanguageDropdown(!showLanguageDropdown); setShowDropdown(false); }}
              className="flex items-center gap-2 text-[#f0f0f5] hover:text-[#5b6ef5] transition-colors"
            >
              <Globe size={18} />
              <span className="text-[14px] font-medium">{LANGUAGES.find(l => l.name === language)?.code.toUpperCase() || 'EN'}</span>
            </button>
            {showLanguageDropdown && (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.15, ease: 'easeOut' }}
    style={{
      position: 'absolute',
      right: 0,
      top: '40px',
      width: '200px',
      background: '#111118',
      border: '1px solid #2a2a3e',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      zIndex: 50,
      overflow: 'hidden'
    }}
  >
    {/* Header */}
    <div style={{
      padding: '10px 16px',
      borderBottom: '1px solid #1e1e2e',
      background: '#161622'
    }}>
      <p style={{
        fontSize: '11px',
        color: '#9090a8',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: 600,
        margin: 0
      }}>
        Language
      </p>
    </div>

    {/* Scrollable list */}
    <div style={{
      maxHeight: '240px',
      overflowY: 'auto',
      padding: '6px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px'
    }}>
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          onClick={() => {
            setLanguage(lang.name)
            setShowLanguageDropdown(false)
          }}
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '8px 12px',
            fontSize: '13px',
            color: language === lang.name ? 'white' : '#c0c0d0',
            background: language === lang.name ? '#5b6ef5' : 'transparent',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: language === lang.name ? 500 : 400,
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onMouseEnter={e => {
            if (language !== lang.name) {
              e.currentTarget.style.background = '#1e1e2e'
              e.currentTarget.style.color = '#f0f0f5'
            }
          }}
          onMouseLeave={e => {
            if (language !== lang.name) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#c0c0d0'
            }
          }}
        >
          <span>{lang.name}</span>
          {language === lang.name && (
            <span style={{ fontSize: '12px' }}>✓</span>
          )}
        </button>
      ))}
    </div>
  </motion.div>
)}
          </div>

          {loading ? null : !user ? (
            <button
              onClick={() => router.push('/login')}
              className="flex items-center gap-2 text-[14px] font-medium bg-[#5b6ef5] text-white rounded-[8px] hover:bg-[#4a5cd4] transition-colors"
              style={{ padding: '8px 20px' }}
            >
              Sign in
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => { setShowDropdown(!showDropdown); setShowLanguageDropdown(false); }}
                className="flex items-center gap-2"
              >
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="User photo"
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-[#1e1e2e]"
                  />
                ) : (
                  <div className="w-[32px] h-[32px] rounded-full border-2 border-[#1e1e2e] bg-[#1a1a28] flex items-center justify-center text-[#f0f0f5] text-[14px]">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-[14px] text-[#f0f0f5]">
                  {user.displayName ? (user.displayName.length > 12 ? user.displayName.substring(0, 12) + '...' : user.displayName) : 'User'}
                </span>
                <ChevronDown size={14} className="text-[#9090a8]" />
              </button>

              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 flex flex-col z-50 overflow-hidden"
                  style={{ width: '240px', background: '#111118', border: '1px solid #2a2a3e', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(91, 110, 245, 0.1)' }}
                >
                  <div style={{ padding: '12px 16px', background: '#161622', borderBottom: '1px solid #2a2a3e' }}>
                    <p style={{ fontSize: '11px', color: '#9090a8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, margin: '0 0 4px' }}>Signed in as</p>
                    <p style={{ fontSize: '13px', color: '#f0f0f5', fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                  </div>

                  <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                      onClick={() => { router.push('/profile'); setShowDropdown(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '14px', color: '#c0c0d0', background: 'transparent', border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.currentTarget.style.color = '#f0f0f5'; e.currentTarget.style.background = '#1e1e2e'; }}
                      onMouseOut={(e) => { e.currentTarget.style.color = '#c0c0d0'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <UserIcon size={16} color="#9090a8" /> My Profile
                    </button>
                    <button
                      onClick={() => { router.push('/leaderboard'); setShowDropdown(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '14px', color: '#c0c0d0', background: 'transparent', border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.currentTarget.style.color = '#f0f0f5'; e.currentTarget.style.background = '#1e1e2e'; }}
                      onMouseOut={(e) => { e.currentTarget.style.color = '#c0c0d0'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Trophy size={16} color="#9090a8" /> Leaderboard
                    </button>
                  </div>

                  <div style={{ height: '1px', background: '#2a2a3e', width: '100%' }} />
                  
                  <div style={{ padding: '8px' }}>
                    <button
                      onClick={handleSignOut}
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '14px', color: '#ef4444', background: 'transparent', border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="sm:hidden flex items-center">
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-[#f0f0f5] p-2"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="sm:hidden absolute top-[64px] left-0 right-0 bg-[#111118] border-b border-[#1e1e2e] p-4 flex flex-col gap-4 shadow-xl">
            <div className="flex flex-wrap gap-2 pb-4 border-b border-[#1e1e2e]">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.name)}
                  className={`px-3 py-1.5 rounded-[8px] text-[13px] font-medium border ${language === lang.name ? 'bg-[#5b6ef5] border-[#5b6ef5] text-white' : 'bg-transparent border-[#2a2a3e] text-[#9090a8]'}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            {loading ? null : !user ? (
              <button
                onClick={() => { router.push('/login'); setShowMobileMenu(false); }}
                className="w-full flex items-center justify-center gap-2 text-[14px] font-medium bg-[#5b6ef5] text-white rounded-[8px]"
                style={{ padding: '12px 16px' }}
              >
                Sign in
              </button>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 pb-4 border-b border-[#1e1e2e]">
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt="User photo" width={40} height={40} className="rounded-full border-2 border-[#1e1e2e]" />
                  ) : (
                    <div className="w-[40px] h-[40px] rounded-full border-2 border-[#1e1e2e] bg-[#1a1a28] flex items-center justify-center text-[#f0f0f5] text-[16px]">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-[15px] font-medium text-[#f0f0f5]">
                    {user.displayName || 'User'}
                  </span>
                </div>
                <button
                  onClick={() => { router.push('/profile'); setShowMobileMenu(false); }}
                  className="w-full text-left px-2 py-2 text-[15px] text-[#f0f0f5] font-medium"
                >
                  My Profile
                </button>
                <button
                  onClick={() => { router.push('/leaderboard'); setShowMobileMenu(false); }}
                  className="w-full text-left px-2 py-2 text-[15px] text-[#f0f0f5] font-medium"
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => { handleSignOut(); setShowMobileMenu(false); }}
                  className="w-full text-left px-2 py-2 text-[15px] text-[#ef4444] font-medium"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
