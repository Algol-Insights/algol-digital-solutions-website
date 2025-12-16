import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

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

    const { orderId } = await request.json()

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Missing order ID' }),
        { status: 400 }
      )
    }

    const accessToken = await getPayPalAccessToken()

    // Capture PayPal order payment
    const response = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to capture PayPal order')
    }

    const capturedOrder = await response.json()

    // Update order status in database
    const purchaseUnit = capturedOrder.purchase_units[0]
    if (purchaseUnit?.payments?.captures?.[0]) {
      const capture = purchaseUnit.payments.captures[0]
      const referenceId = purchaseUnit.reference_id

      // Update order in database
      await prisma.order.update({
        where: { orderNumber: referenceId },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'CONFIRMED',
          transactionId: capture.id,
        },
      })
    }

    return Response.json({
      success: true,
      orderId: capturedOrder.id,
      status: capturedOrder.status,
      amount: purchaseUnit?.amount?.value,
      currency: purchaseUnit?.amount?.currency_code,
    })
  } catch (error: any) {
    console.error('PayPal capture error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Capture failed' }),
      { status: 500 }
    )
  }
}
