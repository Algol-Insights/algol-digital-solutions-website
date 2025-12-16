'use client'

import { useState } from 'react'
import { Button } from '@/components/ui-lib'
import { CheckCircle, XCircle, Loader2, Tag } from 'lucide-react'

interface CouponInputProps {
  subtotal: number
  shippingCost: number
  onCouponApply: (discount: number, code: string) => void
  onCouponRemove: () => void
}

export function CouponInput({
  subtotal,
  shippingCost,
  onCouponApply,
  onCouponRemove,
}: CouponInputProps) {
  const [code, setCode] = useState('')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [discount, setDiscount] = useState(0)
  const [isValidating, setIsValidating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleApplyCoupon = async () => {
    if (!code.trim()) return

    setIsValidating(true)
    setMessage(null)

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          subtotal,
          shippingCost,
        }),
      })

      const result = await response.json()

      if (result.valid) {
        setAppliedCode(code.toUpperCase())
        setDiscount(result.discount)
        setMessage({ type: 'success', text: result.message })
        onCouponApply(result.discount, code.toUpperCase())
      } else {
        setMessage({ type: 'error', text: result.message })
        setAppliedCode(null)
        setDiscount(0)
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to validate coupon' })
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCode('')
    setAppliedCode(null)
    setDiscount(0)
    setMessage(null)
    onCouponRemove()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <label className="text-sm font-medium">Promo Code</label>
      </div>

      {appliedCode ? (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                {appliedCode}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                -${discount.toFixed(2)} discount applied
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveCoupon}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Remove
          </Button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isValidating}
            />
            <Button
              type="button"
              onClick={handleApplyCoupon}
              disabled={!code.trim() || isValidating}
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating
                </>
              ) : (
                'Apply'
              )}
            </Button>
          </div>

          {message && (
            <div
              className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              )}
              <p>{message.text}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
