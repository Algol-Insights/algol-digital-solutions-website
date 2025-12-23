import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'
import { TokenBucketLimiter } from '@/lib/rate-limit'
import { perfMonitor } from '@/lib/performance'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-11-17.clover' as any,
  })
}

// Rate limiter: 30 requests per minute for payment intents
const paymentRateLimiter = new TokenBucketLimiter(30, 60000)

export async function POST(request: Request) {
  const startTime = Date.now()
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  
  // Apply rate limiting
  const rate = paymentRateLimiter.consume(ip)
  if (!rate.ok) {
    perfMonitor.log('API_REQUEST', '/api/payments/create-payment-intent', Date.now() - startTime, {
      status: 429,
      ip,
    })
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { 
        status: 429,
        headers: {
          'Retry-After': String(rate.retryAfterMs ? Math.ceil(rate.retryAfterMs / 1000) : 60),
          'X-RateLimit-Remaining': String(rate.remaining),
        }
      }
    )
  }
  try {
    const stripe = getStripe()
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    const { amount, currency = 'USD', metadata } = await request.json()

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400 }
      )
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      description: `Algol Digital Solutions - Order Payment`,
      metadata: {
        userId: (session.user as any).id,
        userEmail: session.user.email ?? undefined,
        ...metadata,
      },
      receipt_email: session.user.email ?? undefined,
    })

    const duration = Date.now() - startTime
    perfMonitor.log('API_REQUEST', '/api/payments/create-payment-intent', duration, {
      status: 200,
      amount: paymentIntent.amount,
      ip,
    })
    
    return Response.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    })
  } catch (error: any) {
    console.error('Payment intent creation error:', error)
    const duration = Date.now() - startTime
    perfMonitor.log('ERROR', '/api/payments/create-payment-intent', duration, {
      error: error.message,
      ip,
    })
    return new Response(
      JSON.stringify({ error: error.message || 'Payment processing failed' }),
      { status: 500 }
    )
  }
}
