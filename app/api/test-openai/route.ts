import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        status: 'error',
        message: 'OpenAI API key not found in environment variables',
        hasKey: false,
      })
    }

    const openai = new OpenAI({ apiKey })

    // Test with a simple completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: 'Say "API is working" in exactly 3 words' }
      ],
      max_tokens: 10,
    })

    const response = completion.choices[0]?.message?.content

    return NextResponse.json({
      status: 'success',
      message: 'OpenAI API is configured and working',
      hasKey: true,
      keyLength: apiKey.length,
      testResponse: response,
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      hasKey: !!process.env.OPENAI_API_KEY,
    })
  }
}
