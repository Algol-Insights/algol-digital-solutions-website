'use client'

import { useRouter } from 'next/navigation'
import CouponForm from '@/components/coupon-form'

export default function NewCouponPage() {
  const router = useRouter()

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
          <h1 className="text-4xl font-bold">Create New Coupon</h1>
          <p className="text-slate-400 mt-2">
            Set up a new discount code for your customers
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
          <CouponForm />
        </div>
      </div>
    </div>
  )
}
