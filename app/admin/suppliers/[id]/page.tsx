'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui-lib/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-lib/card'
import { Input } from '@/components/ui-lib/input'

interface ProductSummary {
  id: string
  name: string
  sku?: string
  price?: number
}

interface ProductSupplier {
  id: string
  productId: string
  supplierId: string
  supplierSku: string
  cost: number
  leadTime?: number | null
  preferred: boolean
  product: ProductSummary
}

interface ReorderTask {
  id: string
  status: string
  product: { id: string; name: string; sku?: string }
  createdAt: string
  orderedAt?: string | null
  receivedAt?: string | null
  expectedAt?: string | null
  cost?: number | null
}

interface SupplierDetail {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  leadTime: number
  minOrderQuantity: number
  costPerUnit: number
  maxOrderQuantity?: number | null
  preferredCategories: string[]
  active: boolean
  productSuppliers: ProductSupplier[]
  reorders: ReorderTask[]
}

interface ProductSearchHit {
  id: string
  name: string
  sku?: string
  price?: number
}

export default function SupplierDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const supplierId = params?.id

  const [supplier, setSupplier] = useState<SupplierDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<ProductSearchHit[]>([])
  const [linkForm, setLinkForm] = useState({
    productId: '',
    supplierSku: '',
    cost: '',
    leadTime: '',
    preferred: false,
  })

  useEffect(() => {
    if (!supplierId) return
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/admin/suppliers/${supplierId}`)
        if (!res.ok) throw new Error('Failed to load supplier')
        const data = await res.json()
        setSupplier(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load supplier')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [supplierId])

  useEffect(() => {
    const run = async () => {
      if (!search || search.length < 2) {
        setSearchResults([])
        return
      }
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(search)}&limit=5`)
        if (!res.ok) return
        const payload = await res.json()
        setSearchResults(payload.data || [])
      } catch (err) {
        console.error('Search failed', err)
      }
    }
    const timer = setTimeout(run, 250)
    return () => clearTimeout(timer)
  }, [search])

  const refreshSupplier = async () => {
    if (!supplierId) return
    const res = await fetch(`/api/admin/suppliers/${supplierId}`)
    if (res.ok) {
      setSupplier(await res.json())
    }
  }

  const linkProduct = async () => {
    if (!supplierId || !linkForm.productId || !linkForm.supplierSku || !linkForm.cost) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/suppliers/${supplierId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: linkForm.productId,
          supplierSku: linkForm.supplierSku,
          cost: parseFloat(linkForm.cost),
          leadTime: linkForm.leadTime ? parseInt(linkForm.leadTime, 10) : undefined,
          preferred: linkForm.preferred,
        }),
      })
      if (!res.ok) throw new Error('Failed to link product')
      setLinkForm({ productId: '', supplierSku: '', cost: '', leadTime: '', preferred: false })
      setSearch('')
      setSearchResults([])
      await refreshSupplier()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link product')
    } finally {
      setSaving(false)
    }
  }

  const unlinkProduct = async (productId: string) => {
    if (!supplierId) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/suppliers/${supplierId}/products`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      if (!res.ok) throw new Error('Failed to unlink product')
      await refreshSupplier()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlink product')
    } finally {
      setSaving(false)
    }
  }

  const performance = useMemo(() => {
    if (!supplier) return null
    const totalOrders = supplier.reorders.length
    const completed = supplier.reorders.filter((r) => r.status === 'RECEIVED')
    const onTime = completed.filter(
      (r) => r.receivedAt && r.expectedAt && new Date(r.receivedAt) <= new Date(r.expectedAt)
    )
    const totalCost = completed.reduce((sum, r) => sum + (r.cost || 0), 0)
    const avgOrderValue = completed.length ? totalCost / completed.length : 0
    const onTimeRate = completed.length ? (onTime.length / completed.length) * 100 : 0

    return { totalOrders, completed: completed.length, onTimeRate, totalCost, avgOrderValue }
  }, [supplier])

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 p-10">Loading...</div>
  }

  if (!supplier || error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-10 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Supplier</h1>
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
        </div>
        <p className="text-red-400 text-sm">{error || 'Supplier not found'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{supplier.name}</h1>
            <p className="text-slate-400 text-sm">Lead time {supplier.leadTime} days • Min order {supplier.minOrderQuantity}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge variant={supplier.active ? 'default' : 'outline'}>{supplier.active ? 'Active' : 'Inactive'}</Badge>
              <Badge variant="outline">Cost/unit ${supplier.costPerUnit.toFixed(2)}</Badge>
              {supplier.maxOrderQuantity && <Badge variant="outline">Max order {supplier.maxOrderQuantity}</Badge>}
            </div>
          </div>
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Linked Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {supplier.productSuppliers.length === 0 ? (
                <p className="text-slate-400 text-sm">No linked products yet.</p>
              ) : (
                <div className="space-y-3">
                  {supplier.productSuppliers.map((ps) => (
                    <div key={ps.id} className="flex flex-col md:flex-row md:items-center md:justify-between border border-slate-800 rounded-lg p-3 gap-3">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold">{ps.product.name}</div>
                        <div className="text-xs text-slate-400">SKU {ps.product.sku || 'n/a'}</div>
                        <div className="text-xs text-slate-400">Supplier SKU {ps.supplierSku}</div>
                        <div className="text-xs text-slate-400">Cost ${ps.cost.toFixed(2)} • Lead {ps.leadTime || supplier.leadTime}d</div>
                        {ps.preferred && <Badge variant="outline">Preferred</Badge>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => unlinkProduct(ps.productId)} disabled={saving}>Unlink</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Link Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-200">
              <Input
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      className="w-full text-left border border-slate-800 rounded p-2 hover:border-slate-600"
                      onClick={() =>
                        setLinkForm((f) => ({
                          ...f,
                          productId: p.id,
                          supplierSku: p.sku || '',
                          cost: supplier.costPerUnit.toString(),
                        }))
                      }
                    >
                      <div className="font-semibold text-sm">{p.name}</div>
                      <div className="text-xs text-slate-400">{p.sku || 'No SKU'}</div>
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Product ID"
                  value={linkForm.productId}
                  onChange={(e) => setLinkForm({ ...linkForm, productId: e.target.value })}
                />
                <Input
                  placeholder="Supplier SKU"
                  value={linkForm.supplierSku}
                  onChange={(e) => setLinkForm({ ...linkForm, supplierSku: e.target.value })}
                />
                <Input
                  placeholder="Cost"
                  type="number"
                  value={linkForm.cost}
                  onChange={(e) => setLinkForm({ ...linkForm, cost: e.target.value })}
                />
                <Input
                  placeholder="Lead time (days)"
                  type="number"
                  value={linkForm.leadTime}
                  onChange={(e) => setLinkForm({ ...linkForm, leadTime: e.target.value })}
                />
                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={linkForm.preferred}
                    onChange={(e) => setLinkForm({ ...linkForm, preferred: e.target.checked })}
                  />
                  Mark preferred
                </label>
              </div>
              <Button onClick={linkProduct} disabled={saving || !linkForm.productId || !linkForm.supplierSku || !linkForm.cost}>
                {saving ? 'Saving...' : 'Link Product'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-slate-200">
              <div>Email: {supplier.email}</div>
              {supplier.phone && <div>Phone: {supplier.phone}</div>}
              {supplier.address && <div className="text-slate-400 whitespace-pre-line">{supplier.address}</div>}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-slate-200">
              <div>Total orders: {performance?.totalOrders || 0}</div>
              <div>Completed: {performance?.completed || 0}</div>
              <div>On-time: {performance ? performance.onTimeRate.toFixed(1) : '0.0'}%</div>
              <div>Total cost: ${performance ? performance.totalCost.toFixed(2) : '0.00'}</div>
              <div>Avg order value: ${performance ? performance.avgOrderValue.toFixed(2) : '0.00'}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Recent Reorders</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-slate-200">
              {supplier.reorders.length === 0 ? (
                <p className="text-slate-400">No reorder history</p>
              ) : (
                supplier.reorders.slice(0, 5).map((r) => (
                  <div key={r.id} className="border border-slate-800 rounded p-2">
                    <div className="font-semibold text-sm">{r.product?.name}</div>
                    <div className="text-xs text-slate-400">{r.product?.sku || 'n/a'}</div>
                    <div className="text-xs text-slate-300">Status: {r.status}</div>
                    {r.expectedAt && (
                      <div className="text-xs text-slate-400">ETA {new Date(r.expectedAt).toLocaleDateString()}</div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
