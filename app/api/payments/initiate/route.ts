import { NextRequest, NextResponse } from 'next/server'
import { initiatePayment, type PaymentConfig } from '@/lib/payment-gateways'
import { TokenBucketLimiter } from '@/lib/rate-limit'
import { perfMonitor } from '@/lib/performance'

// Rate limiter: 30 requests per minute for payment initiation
const paymentRateLimiter = new TokenBucketLimiter(30, 60000)

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  
  // Apply rate limiting
  const rate = paymentRateLimiter.consume(ip)
  if (!rate.ok) {
    perfMonitor.log('API_REQUEST', '/api/payments/initiate', Date.now() - startTime, {
      status: 429,
      ip,
    })
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
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
    const body = await request.json()

    const {
      gateway,
      amount,
      currency,
      reference,
      customerEmail,
      customerName,
      metadata,
    } = body as PaymentConfig

    // Validation
    if (!gateway || !amount || !currency || !reference || !customerEmail || !customerName) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 },
      )
    }

    // Initiate payment with selected gateway
    const paymentResponse = await initiatePayment({
      gateway,
      amount,
      currency,
      reference,
      customerEmail,
      customerName,
      metadata,
    })

    // Log payment attempt (in production, save to database)
    console.log('[PAYMENT] Initiated:', {
      gateway,
      amount,
      reference,
      customerEmail,
      transactionId: paymentResponse.transactionId,
      timestamp: new Date().toISOString(),
    })

    const duration = Date.now() - startTime
    perfMonitor.log('API_REQUEST', '/api/payments/initiate', duration, {
      status: paymentResponse.success ? 200 : 400,
      gateway,
      amount,
      ip,
    })

    return NextResponse.json(paymentResponse, {
      status: paymentResponse.success ? 200 : 400,
    })
  } catch (error) {
    console.error('[PAYMENT] Error:', error)
    
    const duration = Date.now() - startTime
    perfMonitor.log('ERROR', '/api/payments/initiate', duration, {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip,
    })

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Payment initiation failed',
      },
      { status: 500 },
    )
  }
}
