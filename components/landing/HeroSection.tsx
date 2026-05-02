'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { countries } from '@/lib/countries';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function HeroSection() {
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const [lastCountry, setLastCountry] = useState<string | null>(null);

  useEffect(() => {
    const savedCountry = localStorage.getItem('election_app_country_name');
    if (savedCountry) {
      setLastCountry(savedCountry.toLowerCase().split(' ').join('-'));
    }
  }, []);

  useEffect(() => {
    const currentWord = countries[currentCountryIndex]?.name || 'India';
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (typedText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setTypedText(currentWord.substring(0, typedText.length + 1));
        }, 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 1800);
      }
    } else {
      if (typedText.length > 0) {
        timeout = setTimeout(() => {
          setTypedText(currentWord.substring(0, typedText.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setCurrentCountryIndex((prev) => (prev + 1) % countries.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentCountryIndex]);

  const scrollToCountryPicker = () => {
    document.getElementById('country-picker')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '64px',
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 59px,
              rgba(255,255,255,0.03) 59px,
              rgba(255,255,255,0.03) 60px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 59px,
              rgba(255,255,255,0.03) 59px,
              rgba(255,255,255,0.03) 60px
            )
          `,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '860px',
          width: '90%',
          padding: '80px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Pill Badge */}
        {user ? (
          <Link href={lastCountry ? `/${lastCountry}/guide` : '#country-picker'} style={{ textDecoration: 'none' }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
              whileHover={{ scale: 1.02 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(91, 110, 245, 0.1)',
                border: '1px solid rgba(91, 110, 245, 0.3)',
                borderRadius: '100px',
                padding: '6px 14px',
                marginBottom: '32px',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#5b6ef5',
                  animation: 'pulse-dot 2s infinite',
                }}
              />
              <span
                style={{
                  fontSize: '13px',
                  color: '#5b6ef5',
                  fontWeight: 500,
                }}
              >
                Welcome back, {user.displayName?.split(' ')[0] || 'User'}!
              </span>
              <ArrowRight size={14} color="#5b6ef5" />
            </motion.div>
          </Link>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '100px',
              padding: '6px 14px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#5b6ef5',
                animation: 'pulse-dot 2s infinite',
              }}
            />
            <span
              style={{
                fontSize: '12px',
                color: '#9090a8',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              AI-powered civic education
            </span>
          </motion.div>
        )}

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginBottom: '24px', width: '100%' }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px, 7vw, 80px)',
              color: '#f0f0f5',
              lineHeight: 1.1,
              marginBottom: '4px',
            }}
          >
            Understand
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px, 7vw, 80px)',
              color: '#5b6ef5',
              fontStyle: 'italic',
              lineHeight: 1.1,
              marginBottom: '4px',
            }}
          >
            elections in
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px, 7vw, 80px)',
              color: '#f97316',
              lineHeight: 1.1,
              minHeight: 'clamp(53px, 8.4vw, 96px)',
            }}
          >
            {typedText}
            <span
              style={{
                display: 'inline-block',
                width: '3px',
                height: '0.85em',
                background: '#f97316',
                marginLeft: '2px',
                verticalAlign: 'middle',
                animation: 'blink 1.06s infinite',
              }}
            />
          </span>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: '#9090a8',
            maxWidth: '540px',
            lineHeight: 1.7,
            margin: '0 auto 40px',
          }}
        >
          Pick your country. Our AI assistant walks you through every
          step of your election process — registration, voting,
          counting, and more.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={scrollToCountryPicker}
            style={{
              height: '52px',
              padding: '0 32px',
              background: '#5b6ef5',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              letterSpacing: '0.2px',
            }}
          >
            Explore your country
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, borderColor: '#5b6ef5', color: '#f0f0f5' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={scrollToHowItWorks}
            style={{
              height: '52px',
              padding: '0 32px',
              background: 'transparent',
              color: '#9090a8',
              border: '1px solid #1e1e2e',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              letterSpacing: '0.2px',
            }}
          >
            How it works
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={scrollToCountryPicker}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          zIndex: 10,
          gap: '4px',
        }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown
            style={{ width: '20px', height: '20px', color: '#55556a' }}
          />
        </motion.div>
        <span
          style={{
            fontSize: '11px',
            color: '#55556a',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
          }}
        >
          scroll to explore
        </span>
      </motion.div>
    </section>
  );
}