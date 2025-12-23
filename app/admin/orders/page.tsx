'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Package, Truck, CheckCircle, Clock, AlertCircle, Filter, Search, Eye, Edit2, RefreshCw, MoreVertical, ArrowUpDown, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OrderSummary {
  totalOrders: number
  totalRevenue: number
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  subtotal: number
  tax: number
  shipping: number
  createdAt: string
  customer: {
    id: string
    name: string
    email: string
    phone: string | null
  } | null
  items?: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      image: string | null
    }
  }>
}

const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  PENDING: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Pending' },
  PROCESSING: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Processing' },
  SHIPPED: { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Out for Delivery' },
  DELIVERED: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Delivered' },
  CANCELLED: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Cancelled' },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [summary, setSummary] = useState<OrderSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<any[]>([])
  const [showSearchHistory, setShowSearchHistory] = useState(false)

  useEffect(() => {
    loadSearchHistoryFromStorage()
  }, [])

  const loadSearchHistoryFromStorage = () => {
    try {
      const stored = localStorage.getItem('order_search_history')
      if (stored) {
        const history = JSON.parse(stored)
        setSearchHistory(history)
      }
    } catch (err) {
      console.error('Failed to load search history:', err)
    }
  }

  const saveSearchToHistory = () => {
    if (!search) return
    try {
      const existing = JSON.parse(localStorage.getItem('order_search_history') || '[]')
      const newItem = {
        id: Date.now().toString(),
        query: search,
        filters: { status, startDate, endDate },
        createdAt: new Date().toISOString(),
      }
      // Keep only last 10 searches
      const updated = [newItem, ...existing].slice(0, 10)
      localStorage.setItem('order_search_history', JSON.stringify(updated))
      setSearchHistory(updated)
    } catch (err) {
      console.error('Failed to save search:', err)
    }
  }

  const loadOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      if (status !== 'all') params.append('status', status)
      if (search) params.append('search', search)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/admin/orders?${params}`)
      if (!response.ok) throw new Error('Failed to fetch orders')

      const data = await response.json()
      setOrders(data.orders)
      setSummary(data.summary)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [page, status, search, startDate, endDate])

  const sortedOrders = useMemo(() => {
    const sorted = [...orders]
    if (sortBy === 'date') {
      sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      })
    } else if (sortBy === 'total') {
      sorted.sort((a, b) => (sortOrder === 'asc' ? a.total - b.total : b.total - a.total))
    }
    return sorted
  }, [orders, sortBy, sortOrder])

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleBulkUpdate = async (newStatus: string) => {
    if (selected.size === 0) return

    try {
      const response = await fetch('/api/admin/orders/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: Array.from(selected),
          status: newStatus,
        }),
      })

      if (!response.ok) throw new Error('Failed to update orders')

      await loadOrders()
      setSelected(new Set())
      setBulkAction(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update orders')
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const params = new URLSearchParams()
      params.append('format', format)
      if (status !== 'all') params.append('status', status)
      if (search) params.append('search', search)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/admin/orders/export?${params}`)
      if (!response.ok) throw new Error('Failed to export orders')

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders_${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export orders')
    }
  }

  const MetricCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-1">
      <div className="flex items-center justify-between text-slate-300 text-sm">
        <span>{label}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  )
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-slate-950 border-b border-slate-700 py-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-slate-400 hover:text-white mb-2 inline-block">
              ← Back to Admin
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ShoppingBag size={30} /> Orders Management
            </h1>
            <p className="text-slate-400 text-sm">Manage and track customer orders</p>
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-200" onClick={() => loadOrders()} disabled={loading}>
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
            <button onClick={() => setError(null)} className="text-red-300 hover:text-red-100 text-lg">
              ×
            </button>
          </motion.div>
        )}

        {/* Metrics */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard label="Total Orders" value={summary.totalOrders} icon={ShoppingBag} color="text-blue-400" />
            <MetricCard label="Revenue" value={`$${(summary.totalRevenue / 1000).toFixed(1)}K`} icon={Package} color="text-green-400" />
            <MetricCard label="Processing" value={summary.processing + summary.pending} icon={Clock} color="text-yellow-400" />
            <MetricCard label="Delivered" value={summary.delivered} icon={CheckCircle} color="text-emerald-400" />
          </div>
        )}

        {/* Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 relative">
              <label className="text-sm text-slate-300 block mb-2">Search Orders</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Order #, customer name or email"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  onFocus={() => setShowSearchHistory(true)}
                  onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && search) {
                      saveSearchToHistory()
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
                />
              </div>

              {/* Search History Dropdown */}
              {showSearchHistory && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded shadow-lg z-10">
                  {searchHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSearch(item.query)
                        setShowSearchHistory(false)
                      }}
                      className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-700 text-sm border-b border-slate-700 last:border-0"
                    >
                      {item.query}
                      <span className="text-xs text-slate-500 ml-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full md:w-40">
              <label className="text-sm text-slate-300 block mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setPage(1)
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="w-full md:w-40">
              <label className="text-sm text-slate-300 block mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setPage(1)
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
              />
            </div>

            <div className="w-full md:w-40">
              <label className="text-sm text-slate-300 block mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setPage(1)
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
              />
            </div>

            <div className="flex gap-2 items-end">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300"
                onClick={() => handleExport('csv')}
              >
                <Download size={16} className="mr-1" /> CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300"
                onClick={() => handleExport('json')}
              >
                <Download size={16} className="mr-1" /> JSON
              </Button>
            </div>
          </div>

          {selected.size > 0 && (
            <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
              <span className="text-sm text-slate-300">{selected.size} selected</span>
              <select
                value={bulkAction || ''}
                onChange={(e) => {
                  const action = e.target.value
                  if (action) {
                    handleBulkUpdate(action)
                  }
                }}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 text-sm"
              >
                <option value="">Bulk Actions</option>
                <option value="PROCESSING">Mark as Processing</option>
                <option value="SHIPPED">Mark as Shipped</option>
                <option value="DELIVERED">Mark as Delivered</option>
                <option value="CANCELLED">Cancel Orders</option>
              </select>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="inline-block animate-spin mb-3">
                <RefreshCw size={24} />
              </div>
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ShoppingBag size={32} className="mx-auto mb-3 opacity-50" />
              <p>No orders found matching your criteria</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-950 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 w-12 text-left">
                        <input
                          type="checkbox"
                          checked={selected.size === orders.length && orders.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelected(new Set(orders.map((o) => o.id)))
                            } else {
                              setSelected(new Set())
                            }
                          }}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-800"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Items</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {sortedOrders.map((order) => {
                      const config = statusConfig[order.status as keyof typeof statusConfig]
                      const StatusIcon = config.icon
                      const itemCount = order.items?.length || 0

                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-slate-800/50 transition"
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selected.has(order.id)}
                              onChange={() => toggleSelected(order.id)}
                              className="w-4 h-4 rounded border-slate-600 bg-slate-800"
                            />
                          </td>
                          <td className="px-6 py-3">
                            <div className="font-mono text-sm text-blue-400">{order.orderNumber}</div>
                          </td>
                          <td className="px-6 py-3">
                            <div className="text-sm text-white">{order.customer?.name || 'Unknown'}</div>
                            <div className="text-xs text-slate-500">{order.customer?.email}</div>
                          </td>
                          <td className="px-6 py-3">
                            <div className="text-sm text-slate-300">{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="font-semibold text-white">${(order.total / 100).toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <StatusIcon size={16} className={config.color} />
                              <span className={`text-sm font-medium ${config.color}`}>{order.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <div className="text-sm text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:text-white">
                                <Eye size={16} />
                              </Button>
                            </Link>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-slate-950 border-t border-slate-700 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  Page <span className="font-semibold text-white">{page}</span> of{' '}
                  <span className="font-semibold text-white">{Math.ceil(pagination.total / pagination.limit)}</span> •{' '}
                  <span className="font-semibold text-white">{pagination.total}</span> total orders
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1 || loading}
                  >
                    ← Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(pagination.total / pagination.limit) || loading}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
