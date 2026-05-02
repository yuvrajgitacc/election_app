import type { Metadata } from "next";
import { Instrument_Serif, Geist } from "next/font/google";
import "./globals.css";
import { LazyMotion, domAnimation } from "framer-motion";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
});

const geistSans = Geist({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "ElectionApp — Understand Elections in Your Country",
  description: "AI-powered civic education platform for 195 countries. Learn voter registration, election process, voting day, and more in your own language.",
  keywords: "elections, voting, civic education, democracy, voter registration, AI, gemini",
  openGraph: {
    title: "ElectionApp — Understand Elections in Your Country",
    description: "AI-powered civic education platform for 195 countries. Personalized election guides in 22+ languages.",
    url: "https://election-app.vercel.app",
    siteName: "ElectionApp",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElectionApp — Understand Elections in Your Country",
    description: "AI-powered civic education for 195 countries.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0f" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${instrumentSerif.variable} ${geistSans.variable} antialiased min-h-screen flex flex-col`}
        style={{ background: '#0a0a0f' }}
      >
        <LazyMotion features={domAnimation}>
          <main 
            className="flex-1 flex flex-col"
            role="main"
            aria-label="ElectionApp Application"
          >
            <AuthProvider>
              <LanguageProvider>
                {children}
              </LanguageProvider>
            </AuthProvider>
          </main>
        </LazyMotion>
      </body>
    </html>
  );
}