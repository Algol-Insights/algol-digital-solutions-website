'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { createPayPalOrder, capturePayPalOrder } from '@/lib/paypal-client'

interface PayPalCheckoutProps {
  amount: number
  currency: string
  onSuccess?: (orderId: string) => void
  onError?: (error: string) => void
}

export function PayPalCheckout({
  amount,
  currency,
  onSuccess,
  onError,
}: PayPalCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null)

  const handleCreateOrder = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const order = await createPayPalOrder({
        amount,
        currency,
        reference: `order-${Date.now()}`,
        customerEmail: 'customer@example.com',
        customerName: 'Customer',
        items: [
          {
            name: 'Order',
            quantity: 1,
            unitAmount: amount,
          },
        ],
      })

      setPaypalOrderId(order.id)

      // Redirect to PayPal approval URL
      const approvalUrl = order.links?.find((l) => l.rel === 'approve')?.href
      if (approvalUrl) {
        window.location.href = approvalUrl
      }
    } catch (err: any) {
      const message = err.message || 'Failed to create PayPal order'
      setError(message)
      onError?.(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold">PayPal Checkout</h3>

      <div className="bg-gray-50 p-4 rounded border">
        <div className="flex justify-between items-center">
          <span>Amount:</span>
          <span className="font-bold text-lg">
            {currency} {amount.toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleCreateOrder}
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
      >
        {isLoading ? 'Processing...' : 'Continue with PayPal'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        You will be redirected to PayPal to complete your payment
      </p>
    </div>
  )
}
