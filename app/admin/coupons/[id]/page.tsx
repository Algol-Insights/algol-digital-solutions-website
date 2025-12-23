'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CouponForm from '@/components/coupon-form'

export default function EditCouponPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [coupon, setCoupon] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCoupon()
  }, [params.id])

  const fetchCoupon = async () => {
    try {
      const res = await fetch(`/api/admin/coupons/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch coupon')
      const data = await res.json()
      setCoupon(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (error || !coupon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-red-300">
            {error || 'Coupon not found'}
          </div>
          <button
            onClick={() => router.back()}
            className="mt-4 text-slate-400 hover:text-slate-300"
          >
            ← Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-slate-400 hover:text-slate-300 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold">Edit Coupon</h1>
          <p className="text-slate-400 mt-2">
            Modify coupon: <span className="font-mono text-blue-400">{coupon.code}</span>
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
          <CouponForm initialData={coupon} />
        </div>
      </div>
    </div>
  )
}
