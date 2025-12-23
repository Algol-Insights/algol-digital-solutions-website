'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createProduct, updateProduct, getProductById, getCategories, getInventoryHistory, updateInventoryStock } from '@/lib/api'
import type { ApiProduct, ApiCategory, InventoryLogEntry, InventoryUpdateType } from '@/lib/api'

export default function AdminProductForm() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string | undefined
  const isEditing = productId && productId !== 'new'

  const [formData, setFormData] = useState<Partial<ApiProduct>>({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    price: 0,
    originalPrice: 0,
    sku: '',
    stock: 0,
    image: '',
    specs: {},
    featured: false,
    active: true,
  })

  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inventoryError, setInventoryError] = useState<string | null>(null)
  const [inventoryMessage, setInventoryMessage] = useState<string | null>(null)
  const [inventoryHistory, setInventoryHistory] = useState<InventoryLogEntry[]>([])
  const [inventoryLoading, setInventoryLoading] = useState(isEditing)
  const [adjustQuantity, setAdjustQuantity] = useState<number>(0)
  const [adjustType, setAdjustType] = useState<InventoryUpdateType>('ADJUSTMENT')
  const [adjustReason, setAdjustReason] = useState('')
  const [adjusting, setAdjusting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getCategories()
        setCategories(cats)

        if (isEditing && productId) {
          const product = await getProductById(productId)
          setFormData(product)
          await loadInventoryHistory(productId)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isEditing, productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (isEditing && productId) {
        await updateProduct(productId, formData)
      } else {
        await createProduct(formData as Omit<ApiProduct, 'id' | 'createdAt' | 'updatedAt'>)
      }

      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product')
      setSubmitting(false)
    }
  }

  const loadInventoryHistory = async (id: string) => {
    setInventoryLoading(true)
    setInventoryError(null)
    try {
      const history = await getInventoryHistory(id)
      setInventoryHistory(history)
    } catch (err) {
      setInventoryError(err instanceof Error ? err.message : 'Failed to load history')
    } finally {
      setInventoryLoading(false)
    }
  }

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId) return
    if (!adjustQuantity) {
      setInventoryError('Quantity cannot be zero')
      return
    }

    setAdjusting(true)
    setInventoryError(null)
    setInventoryMessage(null)

    try {
      await updateInventoryStock({
        productId,
        quantity: adjustQuantity,
        type: adjustType,
        reason: adjustReason || undefined,
      })

      const updated = await getProductById(productId)
      setFormData(updated)
      await loadInventoryHistory(productId)
      setInventoryMessage('Stock updated')
      setAdjustQuantity(0)
      setAdjustReason('')
      setAdjustType('ADJUSTMENT')
    } catch (err) {
      setInventoryError(err instanceof Error ? err.message : 'Failed to update stock')
    } finally {
      setAdjusting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/admin/products" className="text-slate-400 hover:text-white mb-2 inline-block">
            ← Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Product' : 'Create Product'}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="SKU"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <textarea
                placeholder="Description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                rows={4}
              />
            </div>
          </div>

          {/* Category & Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Price</label>
              <input
                type="number"
                placeholder="Price"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                step="0.01"
                required
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Inventory */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Stock</label>
            <input
              type="number"
              placeholder="Stock Quantity"
              value={formData.stock || 0}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>

          {isEditing && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Adjust Stock</h3>
                  {inventoryMessage && <span className="text-xs text-green-300">{inventoryMessage}</span>}
                </div>
                {inventoryError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-300 text-sm">
                    {inventoryError}
                  </div>
                )}
                <form className="space-y-3" onSubmit={handleAdjustStock}>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Quantity (use negative to deduct)</label>
                    <input
                      type="number"
                      value={adjustQuantity}
                      onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Type</label>
                      <select
                        value={adjustType}
                        onChange={(e) => setAdjustType(e.target.value as InventoryUpdateType)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                      >
                        <option value="ADJUSTMENT">Adjustment</option>
                        <option value="RESTOCK">Restock</option>
                        <option value="SALE">Sale</option>
                        <option value="RETURN">Return</option>
                        <option value="DAMAGE">Damage</option>
                        <option value="CORRECTION">Correction</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Reason</label>
                      <input
                        type="text"
                        value={adjustReason}
                        onChange={(e) => setAdjustReason(e.target.value)}
                        placeholder="Optional note"
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={adjusting} className="w-full bg-blue-600 hover:bg-blue-700">
                    {adjusting ? 'Updating...' : 'Apply Adjustment'}
                  </Button>
                </form>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Inventory History</h3>
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-200" onClick={() => productId && loadInventoryHistory(productId)} disabled={!!inventoryLoading}>
                    Refresh
                  </Button>
                </div>
                {inventoryLoading ? (
                  <p className="text-slate-400 text-sm">Loading history...</p>
                ) : inventoryHistory.length === 0 ? (
                  <p className="text-slate-400 text-sm">No inventory events yet.</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto border border-slate-800 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-800 text-slate-300">
                        <tr>
                          <th className="px-3 py-2 text-left">Change</th>
                          <th className="px-3 py-2 text-left">Reason</th>
                          <th className="px-3 py-2 text-left">From → To</th>
                          <th className="px-3 py-2 text-left">When</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryHistory.map((log) => (
                          <tr key={log.id} className="border-t border-slate-800">
                            <td className="px-3 py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${log.change >= 0 ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
                                {log.change > 0 ? '+' : ''}{log.change}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-slate-200">{log.reason}</td>
                            <td className="px-3 py-2 text-slate-200">{log.previousStock} → {log.newStock}</td>
                            <td className="px-3 py-2 text-slate-400 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Featured & Active */}
          <div className="flex gap-6">
            <label className="flex items-center text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2"
              />
              Featured Product
            </label>
            <label className="flex items-center text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active !== false}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="mr-2"
              />
              Active
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-slate-700">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </Button>
            <Link href="/admin/products" className="flex-1">
              <Button type="button" variant="outline" className="w-full border-slate-600 text-slate-300">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
