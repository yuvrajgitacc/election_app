# ElectionApp 🗳️

> **Your vote. Your voice. Understand it.**

**ElectionApp** is an AI-powered civic education platform built for the **Google Prompt Wars** hackathon. It provides citizens across 195 countries with a personalized, conversational guide to their local election processes, making democracy accessible and understandable for everyone.

---

## 🌍 What is ElectionApp?

Most people want to vote, but they are often held back by complex laws, confusing registration steps, and a lack of clear information. 

**ElectionApp** solves this by using advanced **Prompt Engineering** with **Google Gemini AI** to turn dry government PDFs and Wikipedia pages into an interactive, friendly, and non-partisan conversation.

**195 Countries. 22+ Languages. Zero Confusion.**

---

## ✨ Key Features

### 🤖 AI Election Assistant
A conversational guide that walks users through their country's real election process step-by-step. Powered by Gemini, it explains:
- **Voter Registration** — Who can vote and how.
- **Election Process** — How the system works.
- **Voting Day** — What to expect at the polling booth.
- **Vote Counting** — How results are determined.

### 🔍 AI Fact Checker
Paste any election-related news, WhatsApp forward, or social media claim. ElectionApp instantly analyzes the text and provides a verdict (**True**, **Misleading**, or **False**) with a detailed explanation to combat misinformation.

### 🏆 Gamified Civic Learning
Test your knowledge with AI-generated quizzes for your country. Earn **Civic XP** and collect badges like:
- 🌱 Civic Newcomer
- 📖 Informed Voter
- 🏛️ Democracy Champion
- ⭐ Election Expert

### 🌏 Inclusive & Multilingual
Supports 22+ languages including English, हिन्दी, Español, Français, العربية, and many more, ensuring no citizen is left behind.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS (Modern Light Theme) |
| **AI Engine** | **Google Gemini API** |
| **Auth & DB** | Firebase (Auth + Firestore) |
| **Hosting** | **Google Cloud Run (GCP)** |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yuvrajgitacc/election_app.git
cd election_app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run locally
```bash
npm run dev
```

---

## 🚢 Deployment (Google Cloud Run)

This project is optimized for deployment on **Google Cloud**. To deploy via Cloud Shell:

```bash
gcloud run deploy election-app --source . --region us-central1 --allow-unauthenticated
```

---

## 📄 License

MIT

---

*Built with ❤️ for the **Google Prompt Wars** hackathon to make democracy accessible to all.*
