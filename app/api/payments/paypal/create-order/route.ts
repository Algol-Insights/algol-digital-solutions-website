import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com' // Change to production URL in production

/**
 * Get PayPal access token
 */
async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured')
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token')
  }

  const data = await response.json()
  return data.access_token
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    const { amount, currency, reference, items } = await request.json()

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400 }
      )
    }

    const accessToken = await getPayPalAccessToken()

    // Create order with PayPal API
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: reference,
            amount: {
              currency_code: currency.toUpperCase(),
              value: amount.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: currency.toUpperCase(),
                  value: amount.toFixed(2),
                },
              },
            },
            items: items?.map((item: any) => ({
              name: item.name,
              quantity: item.quantity.toString(),
              unit_amount: {
                currency_code: currency.toUpperCase(),
                value: item.unitAmount.toFixed(2),
              },
            })),
          },
        ],
        application_context: {
          return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3007'}/payment-success`,
          cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3007'}/payment-failed`,
          brand_name: 'Algol Digital Solutions',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create PayPal order')
    }

    const order = await response.json()

    return Response.json({
      id: order.id,
      status: order.status,
      links: order.links,
      approvalUrl: order.links.find((l: any) => l.rel === 'approve_url')?.href,
    })
  } catch (error: any) {
    console.error('PayPal order creation error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Order creation failed' }),
      { status: 500 }
    )
  }
}
