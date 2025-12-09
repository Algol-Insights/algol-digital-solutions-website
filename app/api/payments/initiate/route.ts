import { NextRequest, NextResponse } from 'next/server'
import { initiatePayment, type PaymentConfig } from '@/lib/payment-gateways'

export async function POST(request: NextRequest) {
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

    return NextResponse.json(paymentResponse, {
      status: paymentResponse.success ? 200 : 400,
    })
  } catch (error) {
    console.error('[PAYMENT] Error:', error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Payment initiation failed',
      },
      { status: 500 },
    )
  }
}
