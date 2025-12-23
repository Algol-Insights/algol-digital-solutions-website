'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui-lib/button'
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
  Download,
  BarChart3,
  CheckSquare,
  Square,
  Search,
  Filter,
  ChevronDown,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

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

interface CouponAnalytics {
  id: string
  code: string
  type: string
  value: number
  isActive: boolean
  usageCount: number
  usageLimit: number | null
  totalRevenue: number
  totalDiscount: number
  avgOrderValue: number
  redemptionRate: number
  roi: number
}

interface OverallStats {
  totalCoupons: number
  activeCoupons: number
  totalRevenue: number
  totalDiscount: number
  avgRedemptionRate: number
  avgROI: number
}

export default function AdminCouponsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list')
  const [analytics, setAnalytics] = useState<CouponAnalytics[]>([])
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null)
  const [selectedCoupons, setSelectedCoupons] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [bulkActionMenu, setBulkActionMenu] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isBulkLoading, setIsBulkLoading] = useState(false)

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

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics()
    }
  }, [activeTab])

  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/coupons?search=${searchQuery}`)
      if (response.ok) {
        const data = await response.json()
        setCoupons(data.coupons)
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error)
      toast.error('Failed to load coupons')
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/coupons/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
        setOverallStats(data.overallStats)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      toast.error('Failed to load analytics')
    }
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const response = await fetch('/api/admin/coupons/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `coupons_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        toast.success('Coupons exported successfully')
      }
    } catch (error) {
      console.error('Failed to export coupons:', error)
      toast.error('Failed to export coupons')
    } finally {
      setIsExporting(false)
    }
  }

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete' | 'extend') => {
    if (selectedCoupons.size === 0) {
      toast.error('Please select at least one coupon')
      return
    }

    if (action === 'delete' && !confirm(`Delete ${selectedCoupons.size} coupon(s)?`)) return

    try {
      setIsBulkLoading(true)
      const response = await fetch('/api/admin/coupons/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: Array.from(selectedCoupons),
          action,
        }),
      })

      if (response.ok) {
        setSelectedCoupons(new Set())
        setBulkActionMenu(false)
        await fetchCoupons()
        const actionText = action.charAt(0).toUpperCase() + action.slice(1)
        toast.success(`${selectedCoupons.size} coupon(s) ${actionText.toLowerCase()}d successfully`)
      } else {
        toast.error('Bulk action failed')
      }
    } catch (error) {
      console.error('Bulk action failed:', error)
      toast.error('Bulk action failed')
    } finally {
      setIsBulkLoading(false)
    }
  }

  const toggleCouponSelection = (id: string) => {
    const newSelected = new Set(selectedCoupons)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedCoupons(newSelected)
  }

  const selectAll = () => {
    if (selectedCoupons.size === filteredCoupons.length) {
      setSelectedCoupons(new Set())
    } else {
      setSelectedCoupons(new Set(filteredCoupons.map((c) => c.id)))
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
        toast.success('Coupon deleted successfully')
      } else {
        toast.error('Failed to delete coupon')
      }
    } catch (error) {
      console.error('Failed to delete coupon:', error)
      toast.error('Failed to delete coupon')
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
        toast.success(updated.isActive ? 'Coupon activated' : 'Coupon deactivated')
      } else {
        toast.error('Failed to update coupon')
      }
    } catch (error) {
      console.error('Failed to update coupon:', error)
      toast.error('Failed to update coupon')
    }
  }

  // Filter coupons
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && coupon.isActive) ||
      (filterStatus === 'inactive' && !coupon.isActive)
    return matchesSearch && matchesStatus
  })

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

  const isExpired = (coupon: Coupon) => {
    return new Date(coupon.validUntil) < new Date()
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
          <Link href="/admin/coupons/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Coupon
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'list'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Coupons
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Overall Stats */}
            {overallStats && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Coupons</p>
                  <p className="text-2xl font-bold">{overallStats.totalCoupons || 0}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {overallStats.activeCoupons || 0} active
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold">${(overallStats.totalRevenue || 0).toLocaleString()}</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Discount</p>
                  <p className="text-2xl font-bold">${(overallStats.totalDiscount || 0).toLocaleString()}</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Avg Redemption Rate</p>
                  <p className="text-2xl font-bold">{(overallStats.avgRedemptionRate || 0).toFixed(1)}%</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Avg ROI</p>
                  <p className="text-2xl font-bold">{(overallStats.avgROI || 0).toFixed(1)}%</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <Button onClick={handleExport} disabled={isExporting} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? 'Exporting...' : 'Export Report'}
                  </Button>
                </div>
              </div>
            )}

            {/* Analytics Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Code</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Usage</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Revenue</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Discount</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Redemption %</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">ROI %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.map((item) => (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-mono font-bold">{item.code}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary text-xs">
                            {item.type === 'PERCENTAGE'
                              ? `${item.value}%`
                              : item.type === 'FIXED_AMOUNT'
                                ? `$${item.value}`
                                : 'Free'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {item.usageCount}/{item.usageLimit || '∞'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          ${item.totalRevenue.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          ${item.totalDiscount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {item.redemptionRate.toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className={item.roi > 0 ? 'text-green-600' : 'text-red-600'}>
                            {item.roi.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* List Tab */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search coupons by code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-border bg-background"
              >
                <option value="all">All Coupons</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              <Button
                onClick={handleExport}
                disabled={isExporting}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
            </div>

            {/* Bulk Actions Bar */}
            {selectedCoupons.size > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedCoupons.size === filteredCoupons.length}
                    onChange={selectAll}
                  />
                  <span className="font-medium">{selectedCoupons.size} selected</span>
                </div>

                <div className="relative">
                  <Button
                    size="sm"
                    onClick={() => setBulkActionMenu(!bulkActionMenu)}
                    disabled={isBulkLoading}
                  >
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Actions
                  </Button>

                  {bulkActionMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => handleBulkAction('activate')}
                        disabled={isBulkLoading}
                        className="w-full text-left px-4 py-2 hover:bg-muted disabled:opacity-50"
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleBulkAction('deactivate')}
                        disabled={isBulkLoading}
                        className="w-full text-left px-4 py-2 hover:bg-muted disabled:opacity-50"
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={() => handleBulkAction('extend')}
                        disabled={isBulkLoading}
                        className="w-full text-left px-4 py-2 hover:bg-muted disabled:opacity-50"
                      >
                        Extend Validity (30 days)
                      </button>
                      <button
                        onClick={() => handleBulkAction('delete')}
                        disabled={isBulkLoading}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Coupons Grid or Empty State */}
            {filteredCoupons.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery || filterStatus !== 'all' ? 'No Coupons Found' : 'No Coupons Yet'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create your first coupon to start offering discounts'}
                </p>
                <Link href="/admin/coupons/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Coupon
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`bg-card border rounded-lg p-6 transition-all ${
                      coupon.isActive ? 'border-border' : 'border-muted opacity-60'
                    } ${selectedCoupons.has(coupon.id) ? 'ring-2 ring-primary' : ''}`}
                  >
                    {/* Checkbox */}
                    <div className="flex items-start justify-between mb-4">
                      <Checkbox
                        checked={selectedCoupons.has(coupon.id)}
                        onChange={() => toggleCouponSelection(coupon.id)}
                      />
                      <div className="flex gap-1">
                        {isExpired(coupon) && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-red-600 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            Expired
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coupon Header */}
                    <div className="flex items-start gap-3 mb-4">
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

                    {/* Coupon Details */}
                    <div className="space-y-2 mb-4">
                      {coupon.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {coupon.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        <span>Min: ${coupon.minPurchase.toFixed(2)}</span>
                      </div>

                      {coupon.maxDiscount && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Tag className="h-3 w-3" />
                          <span>Max: ${coupon.maxDiscount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(coupon.validUntil).toLocaleDateString()}</span>
                      </div>

                      {coupon.usageLimit && (
                        <div className="text-sm">
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>Usage:</span>
                            <span className="font-medium">
                              {coupon.usageCount} / {coupon.usageLimit}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1">
                            <div
                              className="bg-primary h-1 rounded-full"
                              style={{
                                width: `${Math.min((coupon.usageCount / coupon.usageLimit) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status and Actions */}
                    <div className="pt-4 border-t border-border space-y-2">
                      <Button
                        size="sm"
                        onClick={() => toggleActive(coupon)}
                        className={`w-full ${
                          coupon.isActive
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                        variant="outline"
                      >
                        {coupon.isActive ? '✓ Active' : '○ Inactive'}
                      </Button>

                      <div className="flex gap-2">
                        <Link href={`/admin/coupons/${coupon.id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full">
                            <Edit2 className="mr-2 h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Simple Checkbox component
function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded border-border cursor-pointer"
    />
  )
}
