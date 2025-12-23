import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    // TODO: Add authentication
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { priceList } = await req.json()

    if (!priceList) {
      return NextResponse.json(
        { error: 'Price list is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a product data extraction assistant. Parse price lists and extract structured product information.
          
Extract the following information for each product:
- name: Product name/model
- description: Brief description of the product
- price: Price in USD (extract number only)
- stock: Available quantity/units
- brand: Manufacturer/brand name
- category: Product category (Laptops, Desktops, Accessories, etc.)
- specs: Object with key technical specifications (processor, RAM, storage, etc.)

Return a JSON array of products. Be accurate and extract all available information.
If a field is not explicitly mentioned, make a reasonable inference based on the product name and context.
For stock, if only "in stock" or similar is mentioned without a number, use 10 as default.

Example output format:
{
  "products": [
    {
      "name": "Dell Latitude 5420",
      "description": "Business laptop with Intel Core i5 processor",
      "price": 850,
      "stock": 10,
      "brand": "Dell",
      "category": "Laptops",
      "specs": {
        "processor": "Intel Core i5",
        "ram": "8GB",
        "storage": "256GB SSD"
      }
    }
  ]
}`
        },
        {
          role: 'user',
          content: priceList
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error('No response from AI')
    }

    const parsed = JSON.parse(result)
    
    return NextResponse.json({
      success: true,
      products: parsed.products || [],
    })
  } catch (error) {
    console.error('AI parsing error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to parse price list',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
