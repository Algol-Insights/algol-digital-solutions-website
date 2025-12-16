'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentIntentId = searchParams.get('payment_intent')
        
        if (!paymentIntentId) {
          setStatus('error')
          setError('No payment intent ID found')
          return
        }

        // Verify payment and get order details
        const response = await fetch('/api/payments/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId }),
        })

        if (!response.ok) {
          throw new Error('Payment verification failed')
        }

        const result = await response.json()

        if (result.success) {
          setStatus('success')
          setOrder(result)
        } else {
          setStatus('error')
          setError(result.message || 'Payment verification failed')
        }
      } catch (err: any) {
        setStatus('error')
        setError(err.message || 'Payment verification error')
      }
    }

    verifyPayment()
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-violet-600" />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
          <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
          <p className="text-gray-600">{error}</p>
          <Link
            href="/checkout"
            className="inline-block px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
          >
            Try Again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          {order && (
            <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-sm">{order.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold">
                  {order.currency} {(order.amount / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-semibold">
                  {order.status}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              A confirmation email has been sent to your email address.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/order-tracking"
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
              >
                Track Order
              </Link>
              <Link
                href="/products"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-violet-600" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
