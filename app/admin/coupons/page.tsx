'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui-lib'
import {
  Plus,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  DollarSign,
  Percent,
  Truck,
  Loader2,
} from 'lucide-react'

interface Coupon {
  id: string
  code: string
  description: string | null
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'
  value: number
  minPurchase: number
  maxDiscount: number | null
  usageLimit: number | null
  usageCount: number
  validFrom: string
  validUntil: string
  isActive: boolean
}

export default function AdminCouponsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      if ((session?.user as any)?.role !== 'ADMIN') {
        router.push('/')
      } else {
        fetchCoupons()
      }
    }
  }, [status, session, router])

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons')
      if (response.ok) {
        const data = await response.json()
        setCoupons(data.coupons)
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCoupons(coupons.filter((c) => c.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete coupon:', error)
    }
  }

  const toggleActive = async (coupon: Coupon) => {
    try {
      const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      })

      if (response.ok) {
        const updated = await response.json()
        setCoupons(coupons.map((c) => (c.id === updated.id ? updated : c)))
      }
    } catch (error) {
      console.error('Failed to update coupon:', error)
    }
  }

  const getCouponTypeIcon = (type: string) => {
    switch (type) {
      case 'PERCENTAGE':
        return <Percent className="h-4 w-4" />
      case 'FIXED_AMOUNT':
        return <DollarSign className="h-4 w-4" />
      case 'FREE_SHIPPING':
        return <Truck className="h-4 w-4" />
    }
  }

  const formatCouponValue = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'PERCENTAGE':
        return `${coupon.value}% off`
      case 'FIXED_AMOUNT':
        return `$${coupon.value} off`
      case 'FREE_SHIPPING':
        return 'Free shipping'
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Coupon Management</h1>
            <p className="text-muted-foreground">
              Create and manage discount coupons for your store
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Button>
        </div>

        {/* Coupons Grid */}
        {coupons.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Coupons Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first coupon to start offering discounts
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Coupon
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`bg-card border rounded-lg p-6 ${
                  coupon.isActive ? 'border-border' : 'border-muted opacity-60'
                }`}
              >
                {/* Coupon Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {getCouponTypeIcon(coupon.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg font-mono">{coupon.code}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatCouponValue(coupon)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleActive(coupon)}
                      className={coupon.isActive ? 'text-green-600' : 'text-gray-400'}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </Button>
                  </div>
                </div>

                {/* Coupon Details */}
                <div className="space-y-2 mb-4">
                  {coupon.description && (
                    <p className="text-sm text-muted-foreground">{coupon.description}</p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span>Min purchase: ${coupon.minPurchase.toFixed(2)}</span>
                  </div>

                  {coupon.maxDiscount && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Tag className="h-3 w-3" />
                      <span>Max discount: ${coupon.maxDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Valid until {new Date(coupon.validUntil).toLocaleDateString()}
                    </span>
                  </div>

                  {coupon.usageLimit && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Usage: </span>
                      <span className="font-medium">
                        {coupon.usageCount} / {coupon.usageLimit}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit2 className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => deleteCoupon(coupon.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal Placeholder */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Create New Coupon</h2>
              <p className="text-muted-foreground mb-4">
                Coupon creation form will be implemented here
              </p>
              <Button onClick={() => setShowCreateModal(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
