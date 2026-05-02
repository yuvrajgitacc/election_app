import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { country, message } = await req.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'placeholder' || apiKey.trim() === '') {
      return NextResponse.json({ error: 'Please add your Gemini API key to .env.local.' }, { status: 500 })
    }
    
    const prompt = `You are a strict, highly accurate election fact-checker for ${country}.
Analyze this forwarded message, claim, or news:
"${message}"

Determine if the text provided is True, Misleading, or Fake News specifically regarding ${country}'s elections, political processes, or civic laws.
CRITICAL INSTRUCTION:
- If the user pastes an official rule, a fact-check correction, or a true statement about how elections work (e.g., "Paper rolls are removed from VVPATs after 10 days..."), classify it as TRUE.
- If the user pastes a rumor, a false claim, or a piece of disinformation (e.g., "VVPAT slips are being illegally destroyed immediately..."), classify it as FAKE NEWS.
- If it is partially true but lacks context, classify it as MISLEADING.

Return your answer in EXACTLY this format:
STATUS: [True, Misleading, or Fake News]
EXPLANATION: [2-3 clear sentences explaining exactly why it is true or false, citing real laws, commission guidelines, or verified facts.]`

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey.trim()

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 800
        }
      })
    })

    const data = await geminiRes.json()

    if (!geminiRes.ok) {
      console.error('Gemini API Error:', data)
      return NextResponse.json({ error: data?.error?.message || 'Gemini call failed' }, { status: 500 })
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    if (!text) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    let status = 'Misleading'
    let explanation = text

    const statusMatch = text.match(/STATUS:\s*(True|Misleading|Fake\s*News)/i)
    if (statusMatch) {
      const parsedStatus = statusMatch[1].toLowerCase()
      if (parsedStatus.includes('true')) status = 'True'
      else if (parsedStatus.includes('fake')) status = 'Fake News'
      else status = 'Misleading'

      const explanationMatch = text.match(/EXPLANATION:\s*([\s\S]*)/i)
      if (explanationMatch) {
        explanation = explanationMatch[1].trim()
      } else {
        // If EXPLANATION: missing, just take everything after the status line
        explanation = text.replace(/STATUS:.*?\n/i, '').trim()
      }
    }

    return NextResponse.json({ status, explanation })

  } catch (error: any) {
    console.error('Fact check error:', error)
    return NextResponse.json(
      { error: 'Failed to verify message: ' + error.message },
      { status: 500 }
    )
  }
}
