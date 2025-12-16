import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { validateShippingAddress } from '@/lib/shipping'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    const address = await request.json()

    // Validate address
    const validation = validateShippingAddress(address)

    if (!validation.valid) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          errors: validation.errors 
        }),
        { status: 400 }
      )
    }

    // In production, verify with address validation service
    // e.g., USPS, Google Maps, SmartyStreets API

    return Response.json({
      valid: true,
      normalized: address, // Return normalized address
    })
  } catch (error: any) {
    console.error('Address validation error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Address validation failed' }),
      { status: 500 }
    )
  }
}
