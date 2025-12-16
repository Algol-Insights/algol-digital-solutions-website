import { prisma } from '@/lib/db/prisma'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const sig = (await headers()).get('stripe-signature') || ''

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400 }
      )
    }

    // Handle webhook events
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntentSucceeded.id)
        // Handle successful payment
        break

      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', paymentIntentFailed.id)
        // Handle failed payment
        break

      case 'charge.refunded':
        const chargeRefunded = event.data.object as Stripe.Charge
        console.log('Charge refunded:', chargeRefunded.id)
        // Handle refund
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return Response.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Webhook processing failed' }),
      { status: 500 }
    )
  }
}
