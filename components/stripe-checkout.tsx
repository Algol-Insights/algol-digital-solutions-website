'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'

interface StripeCheckoutProps {
  clientSecret: string
  amount: number
  currency: string
  onSuccess?: (paymentIntentId: string) => void
  onError?: (error: string) => void
}

export function StripeCheckout({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onError,
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Embedded Stripe checkout will be initialized here
    if (!clientSecret) {
      setError('Missing client secret for payment')
    }
  }, [clientSecret])

  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
      )

      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }

      // Verify payment after user completes it
      const response = await fetch('/api/payments/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientSecret }),
      })

      if (!response.ok) {
        throw new Error('Payment verification failed')
      }

      const result = await response.json()

      if (result.success) {
        onSuccess?.(result.transactionId)
      } else {
        setError(result.message || 'Payment failed')
        onError?.(result.message)
      }
    } catch (err: any) {
      const message = err.message || 'Payment processing error'
      setError(message)
      onError?.(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold">Complete Payment</h3>

      <div className="bg-gray-50 p-4 rounded border">
        <div className="flex justify-between items-center">
          <span>Amount:</span>
          <span className="font-bold text-lg">
            {currency} {(amount / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading || !clientSecret}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
      >
        {isLoading ? 'Processing...' : `Pay ${currency} ${(amount / 100).toFixed(2)}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Secure payment powered by Stripe
      </p>
    </div>
  )
}
