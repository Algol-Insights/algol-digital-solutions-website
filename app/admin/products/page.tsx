'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getProducts, deleteProduct, getCategories } from '@/lib/api'
import type { ApiProduct, ApiCategory } from '@/lib/api'

export default function AdminProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [lowStockThreshold, setLowStockThreshold] = useState(5)

  const fetchData = async (targetPage = page) => {
    try {
      setLoading(true)
      setError(null)
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts({ page: targetPage, limit: 20 }),
        getCategories(),
      ])
      setProducts(productsRes.data)
      setTotalPages(productsRes.pagination.pages)
      setCategories(categoriesRes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(page)
  }, [page])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await deleteProduct(id)
      await fetchData(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product')
    }
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown'
  }

  const isLowStock = (stock: number) => stock > 0 && stock <= lowStockThreshold
  const isOutOfStock = (stock: number) => stock <= 0

  const lowStockCount = products.filter(p => isLowStock(p.stock)).length
  const outOfStockCount = products.filter(p => isOutOfStock(p.stock)).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <Link href="/admin" className="text-slate-400 hover:text-white mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Manage Products</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/products/import">
              <Button className="bg-purple-600 hover:bg-purple-700">
                ✨ AI Import
              </Button>
            </Link>
            <Link href="/admin/products/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                + Add Product
              </Button>
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-300">Low-stock threshold</label>
            <input
              type="number"
              min={0}
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Math.max(0, Number(e.target.value)))}
              className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
            />
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">⚠ {lowStockCount} low</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/30">✕ {outOfStockCount} out</span>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-200"
              onClick={() => fetchData(page)}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No products found</p>
            <Link href="/admin/products/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create First Product
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className={`border-b border-slate-700 hover:bg-slate-700/50 transition ${isOutOfStock(product.stock) ? 'bg-red-500/5' : isLowStock(product.stock) ? 'bg-yellow-500/5' : ''}`}
                    >
                      <td className="px-6 py-4 text-sm text-white">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{getCategoryName(product.categoryId)}</td>
                      <td className="px-6 py-4 text-sm text-white">${product.price}</td>
                      <td className="px-6 py-4 text-sm text-white">
                        <div className="flex items-center gap-2">
                          <span>{product.stock}</span>
                          {isOutOfStock(product.stock) && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/20">Out</span>
                          )}
                          {isLowStock(product.stock) && !isOutOfStock(product.stock) && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-200 border border-yellow-500/20">Low</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {product.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/20"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <p className="text-slate-400 text-sm">Page {page} of {totalPages}</p>
              <div className="space-x-2">
                <Button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
