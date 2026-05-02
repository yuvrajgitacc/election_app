import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { systemPrompt, userMessage, country, language } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey || apiKey === 'placeholder' || apiKey.trim() === '') {
      return NextResponse.json({
        text: 'Please add your Gemini API key to .env.local.',
        error: false
      })
    }

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey.trim()

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt + '\n\nUser question: ' + userMessage
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    })

    const data = await geminiRes.json()

    if (!geminiRes.ok) {
      return NextResponse.json({
        text: 'API Error: ' + (data?.error?.message || 'Gemini call failed'),
        error: true
      })
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return NextResponse.json({
        text: 'No response from Gemini. Please try again.',
        error: true
      })
    }

    return NextResponse.json({ text, error: false })

  } catch (error: any) {
    return NextResponse.json({
      text: 'Error: ' + (error?.message || 'Something went wrong'),
      error: true
    })
  }
}