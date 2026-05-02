import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

export const callGemini = async (systemPrompt: string, userMessage: string): Promise<string> => {
  try {
    const response = await axios.post(GEMINI_API_URL, {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const candidate = response.data.candidates?.[0];
    if (!candidate || !candidate.content || !candidate.content.parts) {
      throw new Error('Invalid response from Gemini');
    }

    return candidate.content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini:', error);
    throw new Error('Failed to get response from Gemini API');
  }
};

export const callGeminiJSON = async <T>(prompt: string): Promise<T> => {
  const responseText = await callGemini('Return strictly valid JSON without markdown fences.', prompt);
  try {
    const cleanedText = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(cleanedText) as T;
  } catch (error) {
    console.error('Error parsing JSON from Gemini:', error);
    throw new Error('Failed to parse JSON response');
  }
};
