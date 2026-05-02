import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { country, language } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey || apiKey === 'placeholder' || apiKey.trim() === '') {
      return NextResponse.json({ error: 'Please add your Gemini API key to .env.local.' }, { status: 400 })
    }

    const systemPrompt = `Generate exactly 8 multiple choice quiz questions about elections, voting processes, and civic rights in ${country}. 
Language: ${language}.
Return ONLY a valid JSON array of objects. Do not wrap it in markdown blockquotes like \`\`\`json.
Format strictly like this:
[
  {
    "question": "...",
    "options": ["a", "b", "c", "d"],
    "correctIndex": 0,
    "explanation": "..."
  }
]`

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey.trim()

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          responseMimeType: "application/json"
        }
      })
    })

    const data = await geminiRes.json()
    if (!geminiRes.ok) {
      return NextResponse.json({ error: data?.error?.message || 'Gemini API error' }, { status: 500 })
    }

    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      return NextResponse.json({ error: 'No response from Gemini' }, { status: 500 })
    }

    // Clean up potential markdown formatting
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim()

    try {
      const questions = JSON.parse(text)
      return NextResponse.json({ questions })
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text)
      return NextResponse.json({ error: 'Failed to parse Gemini response. Please try again.' }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 })
  }
}
