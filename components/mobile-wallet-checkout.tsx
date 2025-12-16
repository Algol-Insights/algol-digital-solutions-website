'use client'

import { useState } from 'react'

// Extend Window for Google Pay
declare global {
  interface Window {
    google?: {
      payments?: {
        api: {
          PaymentsClient: new (config: any) => any
        }
      }
    }
    ApplePaySession?: any
  }
}

interface MobileWalletCheckoutProps {
  amount: number
  currency: string
  onSuccess?: (transactionId: string) => void
  onError?: (error: string) => void
}

export function MobileWalletCheckout({
  amount,
  currency,
  onSuccess,
  onError,
}: MobileWalletCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGooglePay = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!window.google?.payments) {
        throw new Error('Google Pay not available')
      }

      const paymentsClient = new window.google.payments.api.PaymentsClient({
        environment: 'TEST', // Change to PRODUCTION in production
      })

      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA'],
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'stripe',
                gatewayMerchantId: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
              },
            },
          },
        ],
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: amount.toString(),
          currencyCode: currency,
        },
      }

      const response = await paymentsClient.loadPaymentData(paymentDataRequest)
      const token = JSON.parse(response.paymentMethodData.tokenizationData.token)

      // Send token to your backend for processing
      const result = await fetch('/api/payments/process-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType: 'google-pay',
          token,
          amount,
          currency,
        }),
      })

      if (!result.ok) {
        throw new Error('Payment processing failed')
      }

      const data = await result.json()
      onSuccess?.(data.transactionId)
    } catch (err: any) {
      const message = err.message || 'Google Pay payment failed'
      setError(message)
      onError?.(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplePay = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!window.ApplePaySession) {
        throw new Error('Apple Pay not available on this device')
      }

      const paymentRequest = {
        countryCode: 'US',
        currencyCode: currency,
        supportedNetworks: ['visa', 'mastercard', 'amex'],
        merchantCapabilities: ['supports3DS'],
        total: {
          label: 'Algol Digital Solutions',
          amount: amount.toString(),
        },
      }

      const session = new window.ApplePaySession(3, paymentRequest)

      session.onvalidatemerchant = async (event: any) => {
        // Validate merchant session
        const response = await fetch('/api/payments/apple-pay/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ validationUrl: event.validationURL }),
        })
        const data = await response.json()
        session.completeMerchantValidation(data)
      }

      session.onpaymentauthorized = async (event: any) => {
        try {
          const result = await fetch('/api/payments/process-wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              walletType: 'apple-pay',
              token: event.payment.token,
              amount,
              currency,
            }),
          })

          if (!result.ok) {
            session.completePayment(window.ApplePaySession.STATUS_FAILURE)
            throw new Error('Payment processing failed')
          }

          session.completePayment(window.ApplePaySession.STATUS_SUCCESS)
          const data = await result.json()
          onSuccess?.(data.transactionId)
        } catch (err: any) {
          session.completePayment(window.ApplePaySession.STATUS_FAILURE)
          const message = err.message || 'Apple Pay payment failed'
          setError(message)
          onError?.(message)
        }
      }

      session.begin()
    } catch (err: any) {
      const message = err.message || 'Apple Pay payment failed'
      setError(message)
      onError?.(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Google Pay Button */}
        <button
          onClick={handleGooglePay}
          disabled={isLoading}
          className="p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
        >
          <span className="text-xl">🔵</span>
          Google Pay
        </button>

        {/* Apple Pay Button */}
        <button
          onClick={handleApplePay}
          disabled={isLoading}
          className="p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
        >
          <span className="text-xl">🍎</span>
          Apple Pay
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        Fast and secure payment with your mobile wallet
      </p>
    </div>
  )
}
