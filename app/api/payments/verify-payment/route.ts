import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'
import { prisma } from '@/lib/db/prisma'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-11-17.clover' as any,
  })
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe()
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    const { paymentIntentId, orderId } = await request.json()

    if (!paymentIntentId) {
      return new Response(
        JSON.stringify({ error: 'Missing payment intent ID' }),
        { status: 400 }
      )
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (!paymentIntent) {
      return new Response(
        JSON.stringify({ error: 'Payment intent not found' }),
        { status: 404 }
      )
    }

    // Check payment status
    if (paymentIntent.status === 'succeeded') {
      // Update order status in database
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'COMPLETED',
            status: 'CONFIRMED',
            transactionId: paymentIntent.id,
          },
        })
      }

      return Response.json({
        success: true,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        transactionId: paymentIntent.id,
      })
    }

    return Response.json({
      success: false,
      status: paymentIntent.status,
      message: `Payment ${paymentIntent.status}`,
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Payment verification failed' }),
      { status: 500 }
    )
  }
}
