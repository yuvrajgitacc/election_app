'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, MessageSquare, Award } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';

const cards = [
  {
    number: "01",
    icon: Globe,
    title: "Pick your country",
    description: "Choose from 195 countries. ElectionApp instantly personalizes everything to your country's real electoral system and laws."
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Talk to the AI guide",
    description: "Ask anything. Our Gemini-powered assistant explains registration, voting, counting, and results — in your own language."
  },
  {
    number: "03",
    icon: Award,
    title: "Learn and earn badges",
    description: "Follow guided paths, take quizzes, and earn civic knowledge badges as you complete each topic."
  }
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section style={{ width: '100%', background: '#111118', padding: '120px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }} ref={ref}>
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '16px', display: 'block' }}>
            The experience
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.2 }}>
            Your personal election guide
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.7 }}>
            Not a textbook. Not a Wikipedia page. A step-by-step AI conversation built around your country's real process.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '64px' }}
        >
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -4, borderColor: '#5b6ef5' }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease' }}
              >
                <div className="absolute top-[-8px] right-[16px] z-0 pointer-events-none select-none">
                  <span className="font-display text-[96px] text-[#1e1e2e]">
                    {card.number}
                  </span>
                </div>

                <div className="relative z-10 w-[48px] h-[48px] bg-[#1a1a28] rounded-[12px] flex items-center justify-center mb-[24px]">
                  <Icon className="w-[24px] h-[24px] text-[#5b6ef5]" />
                </div>

                <h3 className="relative z-10 text-[20px] text-[#f0f0f5] font-medium mb-[8px]">
                  {card.title}
                </h3>
                <p className="relative z-10 text-[14px] text-[#9090a8] leading-[1.7]">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
