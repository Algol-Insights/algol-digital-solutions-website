'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Package, AlertTriangle, DollarSign, Eye, Edit2, History, Plus, RefreshCw, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  bulkUpdateInventoryStock,
  getInventoryHistory,
  getInventorySummary,
  getLowStockInventory,
  getOutOfStockInventory,
  getProducts,
  type ApiProduct,
  type InventoryLogEntry,
  type InventorySummary,
  type InventoryUpdateType,
} from '@/lib/api'
import { DEFAULT_LOW_STOCK_THRESHOLD } from '@/lib/inventory-config'

type StatusFilter = 'all' | 'low' | 'out' | 'ok'

const STORAGE_KEY = 'inventoryLowStockThreshold'

export default function InventoryPage() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [summary, setSummary] = useState<InventorySummary | null>(null)
  const [threshold, setThreshold] = useState<number>(DEFAULT_LOW_STOCK_THRESHOLD)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkQuantity, setBulkQuantity] = useState(0)
  const [bulkType, setBulkType] = useState<InventoryUpdateType>('ADJUSTMENT')
  const [bulkReason, setBulkReason] = useState('')
  const [bulkMessage, setBulkMessage] = useState<string | null>(null)
  const [historyByProduct, setHistoryByProduct] = useState<Record<string, InventoryLogEntry[]>>({})
  const [historyLoading, setHistoryLoading] = useState<Record<string, boolean>>({})
  const [lowStockList, setLowStockList] = useState<ApiProduct[]>([])
  const [outOfStockList, setOutOfStockList] = useState<ApiProduct[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const n = Number(saved)
      if (!Number.isNaN(n)) setThreshold(n)
    }
  }, [])

  const loadData = async (t: number = threshold) => {
    setLoading(true)
    setError(null)
    try {
      const [productRes, summaryRes, lowRes, outRes] = await Promise.all([
        getProducts({ page: 1, limit: 200, includeInactive: true }),
        getInventorySummary(t),
        getLowStockInventory(t),
        getOutOfStockInventory(),
      ])
      setProducts(productRes.data)
      setSummary(summaryRes)
      setLowStockList(lowRes.products || [])
      setOutOfStockList(outRes.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(threshold)
  }, [threshold])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
      const isLow = p.stock > 0 && p.stock <= threshold
      const isOut = p.stock <= 0
      const isOk = !isLow && !isOut
      const matchesStatus =
        status === 'all' ? true :
        status === 'low' ? isLow :
        status === 'out' ? isOut :
        isOk
      return matchesSearch && matchesStatus
    })
  }, [products, search, status, threshold])

  const toggleSelectAll = () => {
    if (selected.size === filteredProducts.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filteredProducts.map((p) => p.id)))
    }
  }

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleBulkAdjust = async () => {
    if (selected.size === 0) return
    if (!bulkQuantity) {
      setBulkMessage('Quantity cannot be zero')
      return
    }
    setBulkMessage(null)
    setLoading(true)
    try {
      await bulkUpdateInventoryStock({
        updates: Array.from(selected).map((id) => ({ productId: id, quantity: bulkQuantity })),
        type: bulkType,
        reason: bulkReason || undefined,
      })
      await loadData(threshold)
      setBulkQuantity(0)
      setBulkReason('')
      setBulkType('ADJUSTMENT')
      setSelected(new Set())
      setBulkMessage('Bulk update applied')
    } catch (err) {
      setBulkMessage(err instanceof Error ? err.message : 'Failed to bulk update')
    } finally {
      setLoading(false)
    }
  }

  const loadHistory = async (productId: string) => {
    setHistoryLoading((prev) => ({ ...prev, [productId]: true }))
    try {
      const history = await getInventoryHistory(productId, 25)
      setHistoryByProduct((prev) => ({ ...prev, [productId]: history }))
    } catch (err) {
      setHistoryByProduct((prev) => ({ ...prev, [productId]: [] }))
      setError(err instanceof Error ? err.message : 'Failed to load history')
    } finally {
      setHistoryLoading((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const totalValue = useMemo(() => products.reduce((sum, p) => sum + (p.stock * p.price), 0), [products])

  const lowCount = summary?.lowStockCount ?? products.filter((p) => p.stock > 0 && p.stock <= threshold).length
  const outCount = summary?.outOfStockCount ?? products.filter((p) => p.stock <= 0).length

  const handleThresholdChange = (value: number) => {
    const safe = Math.max(0, value)
    setThreshold(safe)
    localStorage.setItem(STORAGE_KEY, String(safe))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-slate-950 border-b border-slate-700 py-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-slate-400 hover:text-white mb-2 inline-block">
              ← Back to Admin
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ShoppingBag size={30} /> Inventory Management
            </h1>
            <p className="text-slate-400 text-sm">Live inventory with bulk adjustments and history</p>
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-200" onClick={() => loadData(threshold)} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-sm flex items-center justify-between"
          >
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:text-red-100 text-lg"
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard label="Total Products" value={summary?.totalProducts ?? products.length} helper="SKUs" icon={<Package className="w-4 h-4 text-slate-300" />} />
          <MetricCard label="Inventory Value" value={`$${(totalValue / 1000).toFixed(1)}K`} helper="Total worth" icon={<DollarSign className="w-4 h-4 text-green-400" />} accent="text-green-400" />
          <MetricCard label="Low Stock" value={lowCount} helper={`Threshold ≤ ${threshold}`} icon={<AlertTriangle className="w-4 h-4 text-yellow-400" />} accent="text-yellow-300" />
          <MetricCard label="Out of Stock" value={outCount} helper="Needs restock" icon={<Package className="w-4 h-4 text-red-400" />} accent="text-red-300" />
        </div>

        {/* Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-200">Low-stock threshold</label>
              <input
                type="number"
                min={0}
                value={threshold}
                onChange={(e) => handleThresholdChange(Number(e.target.value))}
                className="w-24 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
              />
              <span className="text-xs text-slate-400">Applies to badges and filters</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusFilter)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
                >
                  <option value="all">All</option>
                  <option value="low">Low stock</option>
                  <option value="out">Out of stock</option>
                  <option value="ok">Healthy</option>
                </select>
              </div>
              <input
                type="search"
                placeholder="Search name or SKU"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-60 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BadgeList title="Low stock" items={lowStockList} tone="yellow" threshold={threshold} />
            <BadgeList title="Out of stock" items={outOfStockList} tone="red" threshold={threshold} />
          </div>
        </div>

        {/* Bulk Adjust */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Bulk adjustment</h3>
              <p className="text-slate-400 text-sm">Selected: {selected.size} items</p>
            </div>
            <Button size="sm" variant="outline" className="border-slate-700 text-slate-200" onClick={handleBulkAdjust} disabled={loading || selected.size === 0}>
              Apply
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="number"
              value={bulkQuantity}
              onChange={(e) => setBulkQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
              placeholder="Quantity (+/-)"
            />
            <select
              value={bulkType}
              onChange={(e) => setBulkType(e.target.value as InventoryUpdateType)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
            >
              <option value="ADJUSTMENT">Adjustment</option>
              <option value="RESTOCK">Restock</option>
              <option value="SALE">Sale</option>
              <option value="RETURN">Return</option>
              <option value="DAMAGE">Damage</option>
              <option value="CORRECTION">Correction</option>
            </select>
            <input
              type="text"
              value={bulkReason}
              onChange={(e) => setBulkReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
              placeholder="Reason (optional)"
            />
            <div className="flex items-center">
              <span className="text-slate-400 text-sm">Note: Applies same delta to all selected SKUs.</span>
            </div>
          </div>
          {bulkMessage && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-sm ${bulkMessage.toLowerCase().includes('failed') || bulkMessage.toLowerCase().includes('cannot') ? 'text-red-300' : 'text-green-300'}`}
            >
              {bulkMessage}
            </motion.p>
          )}
        </div>

        {/* Inventory Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-950 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-300">
                    <input type="checkbox" checked={selected.size === filteredProducts.length && filteredProducts.length > 0} onChange={toggleSelectAll} />
                  </th>
                  <th className="px-4 py-3 text-left text-slate-300">Product</th>
                  <th className="px-4 py-3 text-left text-slate-300">SKU</th>
                  <th className="px-4 py-3 text-left text-slate-300">Category</th>
                  <th className="px-4 py-3 text-left text-slate-300">Stock</th>
                  <th className="px-4 py-3 text-left text-slate-300">Price</th>
                  <th className="px-4 py-3 text-left text-slate-300">Status</th>
                  <th className="px-4 py-3 text-left text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td colSpan={8} className="px-4 py-6 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-500 border-t-slate-200 rounded-full animate-spin" />
                        Loading inventory...
                      </div>
                    </td>
                  </motion.tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-6 text-center text-slate-400">No products match the current filters.</td></tr>
                ) : (
                  filteredProducts.map((product) => {
                    const isLow = product.stock > 0 && product.stock <= threshold
                    const isOut = product.stock <= 0
                    return (
                      <Fragment key={product.id}>
                        <tr key={product.id} className={`border-b border-slate-800 ${isOut ? 'bg-red-500/5' : isLow ? 'bg-yellow-500/5' : ''}`}>
                          <td className="px-4 py-3">
                            <input type="checkbox" checked={selected.has(product.id)} onChange={() => toggleSelected(product.id)} />
                          </td>
                          <td className="px-4 py-3 text-white font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-slate-300 font-mono">{product.sku}</td>
                          <td className="px-4 py-3 text-slate-300">{product.category?.name || '—'}</td>
                          <td className="px-4 py-3 text-slate-200">{product.stock}</td>
                          <td className="px-4 py-3 text-slate-200">${product.price}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isOut ? 'bg-red-500/15 text-red-300 border border-red-500/20' : isLow ? 'bg-yellow-500/15 text-yellow-200 border border-yellow-500/20' : 'bg-green-500/15 text-green-300 border border-green-500/20'
                            }`}>
                              {isOut ? 'Out' : isLow ? 'Low' : 'OK'}
                            </span>
                          </td>
                          <td className="px-4 py-3 flex items-center gap-2">
                            <Link href={`/admin/products/${product.id}`} className="text-blue-300 hover:text-blue-200 text-xs flex items-center gap-1">
                              <Edit2 className="w-4 h-4" /> Edit
                            </Link>
                            <button
                              className="text-slate-300 hover:text-white text-xs flex items-center gap-1"
                              onClick={() => {
                                if (!historyByProduct[product.id]) loadHistory(product.id)
                                else setHistoryByProduct((prev) => {
                                  const next = { ...prev }
                                  delete next[product.id]
                                  return next
                                })
                              }}
                            >
                              <History className="w-4 h-4" /> Logs
                            </button>
                          </td>
                        </tr>
                        {historyByProduct[product.id] && (
                          <tr className="border-b border-slate-800" key={`${product.id}-history`}>
                            <td colSpan={8} className="bg-slate-950/40 px-4 py-3">
                              {historyLoading[product.id] ? (
                                <p className="text-slate-400 text-sm">Loading history...</p>
                              ) : historyByProduct[product.id].length === 0 ? (
                                <p className="text-slate-400 text-sm">No history yet.</p>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs">
                                    <thead className="text-slate-400">
                                      <tr>
                                        <th className="text-left px-2 py-1">Change</th>
                                        <th className="text-left px-2 py-1">Reason</th>
                                        <th className="text-left px-2 py-1">From → To</th>
                                        <th className="text-left px-2 py-1">When</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {historyByProduct[product.id].map((log) => (
                                        <tr key={log.id} className="border-t border-slate-800">
                                          <td className="px-2 py-1">
                                            <span className={`px-2 py-0.5 rounded-full ${log.change >= 0 ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                                              {log.change > 0 ? '+' : ''}{log.change}
                                            </span>
                                          </td>
                                          <td className="px-2 py-1 text-slate-200">{log.reason}</td>
                                          <td className="px-2 py-1 text-slate-200">{log.previousStock} → {log.newStock}</td>
                                          <td className="px-2 py-1 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, helper, icon, accent }: { label: string; value: string | number; helper?: string; icon?: React.ReactNode; accent?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-1">
      <div className="flex items-center justify-between text-slate-300 text-sm">
        <span>{label}</span>
        {icon}
      </div>
      <div className={`text-2xl font-bold ${accent || 'text-white'}`}>{value}</div>
      {helper && <p className="text-slate-400 text-xs">{helper}</p>}
    </div>
  )
}

function BadgeList({ title, items, tone, threshold }: { title: string; items: ApiProduct[]; tone: 'yellow' | 'red'; threshold: number }) {
  const color = tone === 'yellow' ? 'bg-yellow-500/10 text-yellow-200 border-yellow-500/30' : 'bg-red-500/10 text-red-200 border-red-500/30'
  return (
    <div className="border border-slate-800 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-white font-semibold text-sm">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full border ${color}`}>{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-slate-400 text-xs">Nothing here.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.slice(0, 12).map((p) => (
            <Link key={p.id} href={`/admin/products/${p.id}`} className={`text-xs px-2 py-1 rounded-full border ${color}`}>
              {p.name} · stock {p.stock}
            </Link>
          ))}
          {items.length > 12 && <span className="text-slate-400 text-xs">+{items.length - 12} more</span>}
        </div>
      )}
      {tone === 'yellow' && <p className="text-slate-500 text-[11px] mt-2">Threshold ≤ {threshold}</p>}
    </div>
  )
}
