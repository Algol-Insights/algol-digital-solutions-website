import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/db/prisma'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get product catalog for context
    const products = await prisma.product.findMany({
      where: { inStock: true },
      select: {
        id: true,
        name: true,
        brand: true,
        category: true,
        price: true,
        description: true,
        specs: true,
      },
      take: 50, // Limit to recent/popular products
    })

    // Build conversation history
    const conversationHistory = history?.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    })) || []

    // Create system prompt with company info and product context
    const systemPrompt = `You are Algol Assistant, the helpful AI chatbot for Algol Digital Solutions, a leading technology retailer specializing in laptops, desktops, accessories, and IT solutions.

Your responsibilities:
- Help customers find the right products
- Answer questions about specifications, pricing, and availability
- Provide technical support and recommendations
- Assist with order inquiries and delivery information
- Offer professional and friendly customer service

Company Information:
- Name: Algol Digital Solutions
- Tagline: Premium IT Solutions
- Location: Harare, Zimbabwe
- Phone: +263 788 663 313
- Email: info@algoldigital.com
- Website: solutions.algolinsights.com
- Business Hours: Monday-Friday 8:00 AM - 5:00 PM, Saturday 9:00 AM - 2:00 PM (Closed Sundays)

Services:
- Technology retail (laptops, desktops, accessories, networking equipment, storage solutions)
- Authorized partner for: Dell, HP, Cisco, Hikvision
- Product categories: Laptops, Desktops, Servers, Networking, Storage, Security Systems, Accessories
- Delivery: Available across Zimbabwe with multiple payment options (Cash, EcoCash, Innbucks, Bank Transfer, Card)
- Customer Support: Phone, Email, WhatsApp, Live Chat
- After-sales support and warranty services

Social Media:
- Facebook: facebook.com/algoldigitalsolutions
- Instagram: @algoldigitalsolutions
- LinkedIn: linkedin.com/company/algol-digital-solutions
- TikTok: @algoldigitalsolutions
- WhatsApp Channel: whatsapp.com/channel/0029VarnlBhI8FUPoGBqE30C

Available Products (Current Stock):
${products.map(p => `- ${p.name} (${p.brand}) - $${p.price} - ${p.category} ${p.specs ? `- Specs: ${p.specs}` : ''}`).join('\n')}

Guidelines:
- Be friendly, professional, and helpful
- Provide specific product recommendations when relevant
- If you don't know something, admit it and offer to connect them with support
- Keep responses concise but informative
- Use proper formatting for better readability
- For product inquiries, mention specific models, prices, and key features
- Always prioritize customer satisfaction

Never:
- Make up product information not in the database
- Promise things outside your scope (discounts, special deals without authorization)
- Share sensitive business information
- Be rude or dismissive`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || 
      "I apologize, but I'm having trouble responding right now. Please try again or contact our support team."

    return NextResponse.json({
      success: true,
      response,
    })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
