'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Search } from 'lucide-react';
import { countries } from '@/lib/countries';

const LANGUAGES = [
  { name: 'English', code: 'en' },
  { name: 'हिन्दी (Hindi)', code: 'hi' },
  { name: 'Español (Spanish)', code: 'es' },
  { name: 'Français (French)', code: 'fr' },
  { name: 'العربية (Arabic)', code: 'ar' },
  { name: 'Português (Portuguese)', code: 'pt' },
  { name: 'বাংলা (Bengali)', code: 'bn' },
  { name: 'Русский (Russian)', code: 'ru' },
  { name: '日本語 (Japanese)', code: 'ja' },
  { name: 'Deutsch (German)', code: 'de' },
  { name: '中文 (Chinese)', code: 'zh' },
  { name: '한국어 (Korean)', code: 'ko' },
  { name: 'Italiano (Italian)', code: 'it' },
  { name: 'Türkçe (Turkish)', code: 'tr' },
  { name: 'اردو (Urdu)', code: 'ur' },
  { name: 'తెలుగు (Telugu)', code: 'te' },
  { name: 'मराठी (Marathi)', code: 'mr' },
  { name: 'தமிழ் (Tamil)', code: 'ta' },
  { name: 'Kiswahili (Swahili)', code: 'sw' },
  { name: 'Nederlands (Dutch)', code: 'nl' },
  { name: 'Polski (Polish)', code: 'pl' },
  { name: 'Bahasa Indonesia', code: 'id' },
];

const REGIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

export default function CountryPicker() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [filteredCountries, setFilteredCountries] = useState<typeof countries>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  useEffect(() => {
    const savedLang = localStorage.getItem('election_app_language');
    if (savedLang) setSelectedLanguage(savedLang);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCountries([]);
      return;
    }
    const results = countries.filter((c) => {
      const matchName = c.name.toLowerCase().includes(query.toLowerCase());
      const matchRegion = activeRegion ? c.region === activeRegion : true;
      return matchName && matchRegion;
    });
    setFilteredCountries(results);
  };

  const handleRegionClick = (region: string) => {
    const next = activeRegion === region ? null : region;
    setActiveRegion(next);
    if (searchQuery.trim()) {
      const results = countries.filter((c) => {
        const matchName = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchRegion = next ? c.region === next : true;
        return matchName && matchRegion;
      });
      setFilteredCountries(results);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    localStorage.setItem('election_app_language', e.target.value);
  };

  const handleCountrySelect = (country: (typeof countries)[0]) => {
    localStorage.setItem('election_app_country', country.code);
    localStorage.setItem('election_app_country_name', country.name);
    const slug = country.name.toLowerCase().split(' ').join('-');
    router.push(`/${slug}/guide`);
  };

  return (
    <div ref={ref} style={{ width: '100%' }} id="country-picker">
      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: '12px',
          textTransform: 'uppercase',
          color: '#5b6ef5',
          letterSpacing: '2px',
          marginBottom: '16px',
          fontWeight: 500,
        }}
      >
        Choose your country
      </motion.p>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.05 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 5vw, 52px)',
          color: '#111118',
          marginBottom: '12px',
          lineHeight: 1.15,
        }}
      >
        Where are you voting?
      </motion.h2>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          fontSize: '16px',
          color: '#4b5563',
          marginBottom: '40px',
          lineHeight: 1.7,
        }}
      >
        Select your country and language to get a personalized
        election guide from our AI assistant.
      </motion.p>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ position: 'relative', width: '100%' }}
      >
        <Search
          style={{
            position: 'absolute',
            left: '18px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            color: '#6b7280',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for your country..."
          style={{
            width: '100%',
            height: '64px',
            background: '#ffffff',
            border: '1px solid #e9ecef',
            borderRadius: '16px',
            paddingLeft: '52px',
            paddingRight: '24px',
            fontSize: '16px',
            color: '#111118',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#5b6ef5';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e9ecef';
          }}
        />

        {/* Dropdown */}
        <AnimatePresence>
          {searchQuery && filteredCountries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '72px',
                left: 0,
                right: 0,
                zIndex: 50,
                background: '#ffffff',
                border: '1px solid #e9ecef',
                borderRadius: '16px',
                maxHeight: '300px',
                overflowY: 'auto',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }}
            >
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  }}
                  style={{
                    height: '54px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 20px',
                    gap: '14px',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    borderBottom: '1px solid #f1f3f5',
                  }}
                >
                  <span style={{ fontSize: '24px', lineHeight: 1, flexShrink: 0 }}>
                    {country.flag}
                  </span>
                  <span
                    style={{
                      fontSize: '15px',
                      color: '#111118',
                      flex: 1,
                      fontWeight: 400,
                    }}
                  >
                    {country.name}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      background: '#f1f3f5',
                      borderRadius: '100px',
                      padding: '3px 10px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {country.region}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
          {searchQuery && filteredCountries.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: '72px',
                left: 0,
                right: 0,
                zIndex: 50,
                background: '#ffffff',
                border: '1px solid #e9ecef',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                No countries found for "{searchQuery}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Language selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginTop: '16px' }}
      >
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            color: '#4b5563',
            marginBottom: '8px',
          }}
        >
          Preferred language
        </label>
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          style={{
            width: '100%',
            height: '48px',
            background: '#ffffff',
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '0 16px',
            color: '#111118',
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%234b5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
            paddingRight: '40px',
          }}
        >
          {LANGUAGES.map((lang) => (
            <option
              key={lang.code}
              value={lang.name}
              style={{ background: '#ffffff' }}
            >
              {lang.name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Region pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{ marginTop: '24px' }}
      >
        <p
          style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '12px',
          }}
        >
          Browse by region
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => handleRegionClick(region)}
              style={{
                padding: '7px 18px',
                borderRadius: '100px',
                border:
                  activeRegion === region
                    ? '1px solid #5b6ef5'
                    : '1px solid #e9ecef',
                background:
                  activeRegion === region ? '#f1f3f5' : '#ffffff',
                color:
                  activeRegion === region ? '#5b6ef5' : '#4b5563',
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                fontWeight: activeRegion === region ? 500 : 400,
              }}
            >
              {region}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
