import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SHIPPING_RATES, calculateShippingCost } from '@/lib/shipping'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const weight = parseFloat(searchParams.get('weight') || '1')
    const destination = searchParams.get('destination') || 'US'

    // Calculate shipping costs for all carriers
    const rates = SHIPPING_RATES.map((rate) => ({
      ...rate,
      price: calculateShippingCost(rate.carrier, weight, destination),
    }))

    return Response.json({ rates })
  } catch (error: any) {
    console.error('Shipping rates error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to get shipping rates' }),
      { status: 500 }
    )
  }
}
