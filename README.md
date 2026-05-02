# ElectionApp 🗳️

> **Your vote. Your voice. Understand it.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-election--app.vercel.app-5b6ef5?style=for-the-badge&logo=vercel)](https://election-app.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Powered-blue?style=for-the-badge&logo=google)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌍 What is ElectionApp?

Most people don't vote because they don't understand the process.

**ElectionApp** fixes that.

It's a civic education platform that gives every person on the planet a personalized, conversational guide to their country's election process — not a Wikipedia page, not a government PDF, but a real step-by-step interactive assistant that speaks your language, answers your questions, and makes democracy actually understandable.

**195 countries. 22+ languages. Zero confusion.**

---

## ✨ Features

### 🤖 AI Election Assistant
A conversational guide that walks users through their country's real election process step by step. Ask anything — get clear, non-partisan, country-specific answers instantly.

### 🗺️ 5 Structured Learning Paths
- **Voter Registration** — Who can vote and how to register
- **Election Process** — How the full system works
- **Voting Day** — What happens when you walk into a polling booth
- **Vote Counting** — How results are determined
- **Free Q&A** — Ask anything you want

### 🔍 Fact Checker — *New*
Paste any election-related news, forward message, or social media claim. ElectionApp instantly checks whether it is **True**, **Misleading**, or **False** — powered by real-time AI analysis. Stop the spread of misinformation before it spreads.

### 🏆 Civic Quiz + Badges
8 AI-generated questions per country. Beat the clock, score high, earn badges:

| Score | Badge |
|---|---|
| 0 – 3 | 🌱 Civic Newcomer |
| 4 – 5 | 📖 Informed Voter |
| 6 – 7 | 🏛️ Democracy Champion |
| 8 / 8 | ⭐ Election Expert |

### 🎤 Voice Input
Ask questions with your microphone. No typing required.

### 🌏 22+ Languages
English, हिन्दी, Español, Français, العربية, Português, বাংলা, Русский, 日本語, Deutsch, 中文, 한국어, Italiano, Türkçe, اردو, తెలుగు, मराठी, தமிழ், Kiswahili, Nederlands, Polski, Bahasa Indonesia

### 🔐 Authentication
- Google Sign-In
- Email and Password
- Phone OTP

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion v11 |
| AI | Google Gemini API |
| Authentication | Firebase Auth |
| Database | Cloud Firestore |
| Deployment | Vercel |
| Voice | Web Speech API |
| Fonts | Instrument Serif + Geist Sans |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- Firebase project
- Gemini API key

### Clone and Install

```bash
git clone https://github.com/yuvrajgitacc/election_app.git
cd election_app
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
# Gemini AI
GEMINI_API_KEY=

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_TRANSLATE_API_KEY=
```

### Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
election_app/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx                        # Landing page
│   ├── globals.css
│   │
│   ├── login/
│   │   └── page.tsx                    # Authentication
│   │
│   ├── [country]/
│   │   ├── guide/
│   │   │   └── page.tsx                # AI assistant (core)
│   │   ├── quiz/
│   │   │   └── page.tsx                # Civic quiz
│   │   ├── badge/
│   │   │   └── page.tsx                # Badge + certificate
│   │   └── fact-check/
│   │       └── page.tsx                # Fact checker
│   │
│   └── api/
│       ├── gemini/
│       │   └── route.ts                # Gemini AI endpoint
│       ├── quiz/
│       │   └── route.ts                # Quiz generation
│       └── fact-check/
│           └── route.ts                # Fact check endpoint
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── CountryPicker.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── MarqueeStrip.tsx
│   │   └── CTASection.tsx
│   │
│   ├── assistant/
│   │   ├── AssistantWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── PathSelector.tsx
│   │   ├── ProgressBar.tsx
│   │   └── TypingIndicator.tsx
│   │
│   ├── quiz/
│   │   └── QuizApp.tsx
│   │
│   ├── fact-check/
│   │   └── FactChecker.tsx
│   │
│   └── auth/
│       ├── LoginPage.tsx
│       └── ProtectedRoute.tsx
│
├── context/
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx
│
├── lib/
│   ├── firebase.ts
│   ├── gemini.ts
│   ├── firestore.ts
│   ├── countries.ts
│   ├── animations.ts
│   └── translate.ts
│
├── types/
│   └── index.ts
│
├── .env.local                          # Not committed
├── .gitignore
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔍 Fact Checker — How It Works

The Fact Checker is designed to combat election misinformation:

1. User pastes any news headline, WhatsApp forward, or social media post
2. ElectionApp analyzes the claim against known facts about the selected country's election system
3. Returns a verdict — **True**, **Misleading**, or **False**
4. Shows a clear explanation of why, with context

This feature is especially valuable during election season when misinformation spreads rapidly across messaging platforms.

---

## 🔐 Authentication and Route Protection

Three sign-in methods supported via Firebase:

- **Google** — One-click OAuth
- **Email and Password** — Standard registration and login
- **Phone Number** — OTP verification

All routes under `/[country]/*` are protected. Unauthenticated users are automatically redirected to `/login`.

---

## 🚢 Deployment

Deployed on **Vercel** with automatic deployments on every push to `main`.

### Deploy Your Own

1. Fork this repository
2. Create a new project at [vercel.com](https://vercel.com)
3. Connect the forked repository
4. Add all environment variables in Project Settings → Environment Variables
5. Add your Vercel domain to Firebase Console → Authentication → Authorized Domains
6. Deploy

---

## ⚙️ Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication — Google, Email/Password, Phone
4. Create a Firestore database in test mode
5. Register a web app and copy the config to `.env.local`

---

## 🤖 Gemini API Setup

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click Get API Key → Create API Key
3. Add to `.env.local` as `GEMINI_API_KEY`

---

## 📜 Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm start          # Start production server
npm run lint       # Run ESLint
```

---

## 🤝 Contributing

Pull requests are welcome.

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit changes — `git commit -m 'add your feature'`
4. Push — `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT

---

*Built for the web. Built for everyone. Built to make democracy accessible.*
