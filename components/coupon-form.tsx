'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CouponFormData {
  code: string
  description: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'
  value: number
  minPurchase: number
  maxDiscount: number | null
  usageLimit: number | null
  validFrom: string
  validUntil: string
  isActive: boolean
}

interface CouponFormProps {
  initialData?: CouponFormData & { id: string }
  onSuccess?: () => void
  onCancel?: () => void
}

export default function CouponForm({
  initialData,
  onSuccess,
  onCancel,
}: CouponFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [formData, setFormData] = useState<CouponFormData>({
    code: initialData?.code || '',
    description: initialData?.description || '',
    type: initialData?.type || 'PERCENTAGE',
    value: initialData?.value || 0,
    minPurchase: initialData?.minPurchase || 0,
    maxDiscount: initialData?.maxDiscount || null,
    usageLimit: initialData?.usageLimit || null,
    validFrom: initialData?.validFrom
      ? new Date(initialData.validFrom).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    validUntil: initialData?.validUntil
      ? new Date(initialData.validUntil).toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: initialData?.isActive ?? true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validation
      if (!formData.code.trim()) {
        throw new Error('Coupon code is required')
      }

      if (formData.type !== 'FREE_SHIPPING' && formData.value <= 0) {
        throw new Error('Discount value must be greater than 0')
      }

      if (formData.type === 'PERCENTAGE' && formData.value > 100) {
        throw new Error('Percentage discount cannot exceed 100%')
      }

      if (new Date(formData.validFrom) > new Date(formData.validUntil)) {
        throw new Error('Valid from date must be before valid until date')
      }

      const url = isEditing
        ? `/api/admin/coupons/${initialData.id}`
        : '/api/admin/coupons'

      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          value: formData.type === 'FREE_SHIPPING' ? 0 : formData.value,
          maxDiscount: formData.maxDiscount || undefined,
          usageLimit: formData.usageLimit || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save coupon')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/admin/coupons')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, code })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Code */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Coupon Code *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value.toUpperCase() })
            }
            placeholder="SAVE20"
            className="flex-1 bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={generateCode}
            className="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded font-semibold transition-colors"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="20% off on all products"
          rows={3}
          className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Discount Type *
        </label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING',
            })
          }
          className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="PERCENTAGE">Percentage Discount</option>
          <option value="FIXED_AMOUNT">Fixed Amount Discount</option>
          <option value="FREE_SHIPPING">Free Shipping</option>
        </select>
      </div>

      {/* Value */}
      {formData.type !== 'FREE_SHIPPING' && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Discount Value *
          </label>
          <div className="relative">
            {formData.type === 'PERCENTAGE' && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                %
              </span>
            )}
            {formData.type === 'FIXED_AMOUNT' && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                $
              </span>
            )}
            <input
              type="number"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: parseFloat(e.target.value) })
              }
              min="0"
              max={formData.type === 'PERCENTAGE' ? 100 : undefined}
              step="0.01"
              className={`w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formData.type === 'FIXED_AMOUNT' ? 'pl-8' : ''
              }`}
              required
            />
          </div>
          {formData.type === 'PERCENTAGE' && (
            <p className="text-xs text-slate-400 mt-1">Must be between 0 and 100</p>
          )}
        </div>
      )}

      {/* Min Purchase */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Minimum Purchase Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
          <input
            type="number"
            value={formData.minPurchase}
            onChange={(e) =>
              setFormData({ ...formData, minPurchase: parseFloat(e.target.value) })
            }
            min="0"
            step="0.01"
            className="w-full bg-slate-700 border border-slate-600 rounded pl-8 pr-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Max Discount */}
      {formData.type === 'PERCENTAGE' && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Maximum Discount Amount (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              value={formData.maxDiscount || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxDiscount: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              min="0"
              step="0.01"
              placeholder="No limit"
              className="w-full bg-slate-700 border border-slate-600 rounded pl-8 pr-4 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cap the maximum discount amount for percentage-based coupons
          </p>
        </div>
      )}

      {/* Usage Limit */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Usage Limit (Optional)
        </label>
        <input
          type="number"
          value={formData.usageLimit || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              usageLimit: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          min="1"
          placeholder="Unlimited"
          className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-slate-400 mt-1">
          Leave empty for unlimited usage
        </p>
      </div>

      {/* Valid From */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Valid From *
        </label>
        <input
          type="date"
          value={formData.validFrom}
          onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
          className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Valid Until */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Valid Until *
        </label>
        <input
          type="date"
          value={formData.validUntil}
          onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
          className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Is Active */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4 rounded"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-slate-300">
          Active (coupon can be used immediately)
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-slate-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Saving...' : isEditing ? 'Update Coupon' : 'Create Coupon'}
        </button>
      </div>
    </form>
  )
}
