'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { PaymentMethodSelector } from '@/components/payment-method-selector'
import { StripeCheckout } from '@/components/stripe-checkout'
import { PaymentGateway, initiatePayment } from '@/lib/payment-gateways'
import { CartItem } from '@/lib/cart-store'

interface CheckoutPageProps {
  cartItems: CartItem[]
  subtotal: number
  tax: number
  total: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('stripe')
  const [totalAmount, setTotalAmount] = useState(0)
  const [clientSecret, setClientSecret] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')

  // Mock cart data - replace with actual cart data
  const cartItems: CartItem[] = []
  const subtotal = 150
  const tax = 15
  const shipping = 0
  const total = subtotal + tax

  const handlePaymentMethodSelect = async (
    gateway: PaymentGateway,
    totalWithFees: number
  ) => {
    setSelectedGateway(gateway)
    setTotalAmount(totalWithFees)
    setError('')

    if (gateway === 'stripe') {
      setIsProcessing(true)
      try {
        // Create payment intent for Stripe
        const response = await fetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalWithFees * 100, // Convert to cents
            currency: 'USD',
            metadata: {
              userId: (session?.user as any)?.id,
              cartItems: cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
              })),
            },
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create payment')
        }

        const { clientSecret } = await response.json()
        setClientSecret(clientSecret)
      } catch (err: any) {
        setError(err.message || 'Payment initialization failed')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handlePaymentSuccess = async (transactionId: string) => {
    try {
      // Create order with payment confirmation
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          subtotal,
          tax,
          shipping,
          total: totalAmount,
          paymentMethod: selectedGateway,
          transactionId,
          paymentStatus: 'COMPLETED',
        }),
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const order = await orderResponse.json()
      router.push(`/order-confirmation/${order.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to process order')
    }
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Please log in to continue</h1>
          <p className="text-gray-600">You need to be logged in to complete checkout.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 border-b pb-4">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No items in cart</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <PaymentMethodSelector
                amount={total}
                currency="USD"
                onSelect={handlePaymentMethodSelect}
                selectedGateway={selectedGateway}
              />
            </div>
          </div>

          {/* Sidebar - Payment Processing */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-4 p-6 space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Order Total</h3>
                <p className="text-3xl font-bold text-violet-600">
                  ${totalAmount > 0 ? totalAmount.toFixed(2) : total.toFixed(2)}
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {selectedGateway === 'stripe' && clientSecret && (
                <StripeCheckout
                  clientSecret={clientSecret}
                  amount={totalAmount * 100}
                  currency="USD"
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => setError(err)}
                />
              )}

              {selectedGateway !== 'stripe' && (
                <button
                  disabled={isProcessing}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 text-white font-bold rounded-lg"
                >
                  {isProcessing ? 'Processing...' : 'Continue to Payment'}
                </button>
              )}

              <div className="text-xs text-gray-500 text-center">
                <p>🔒 Your payment is secure and encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
