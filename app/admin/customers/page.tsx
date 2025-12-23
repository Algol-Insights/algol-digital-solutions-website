'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users,
  User,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Download,
  ChevronDown,
  Award,
  Heart,
  Clock,
  AlertTriangle,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  city: string | null
  country: string | null
  createdAt: string
  totalOrders: number
  lifetimeValue: number
  averageOrderValue: number
  lastOrderDate: string | null
  segment: 'VIP' | 'LOYAL' | 'NEW' | 'AT_RISK' | 'INACTIVE' | 'REGULAR'
}

interface Summary {
  totalCustomers: number
  totalRevenue: number
  averageLifetimeValue: number
  segmentCounts: {
    VIP: number
    LOYAL: number
    NEW: number
    INACTIVE: number
  }
}

const segmentConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  VIP: { icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'VIP' },
  LOYAL: { icon: Heart, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Loyal' },
  NEW: { icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'New' },
  AT_RISK: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'At Risk' },
  INACTIVE: { icon: Clock, color: 'text-slate-400', bg: 'bg-slate-500/20', label: 'Inactive' },
  REGULAR: { icon: User, color: 'text-slate-300', bg: 'bg-slate-500/20', label: 'Regular' },
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [segment, setSegment] = useState('all')
  const [search, setSearch] = useState('')
  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [exporting, setExporting] = useState(false)

  const loadCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      if (segment !== 'all') params.append('segment', segment)
      if (search) params.append('search', search)
      if (minValue) params.append('minLifetimeValue', (parseInt(minValue) * 100).toString())
      if (maxValue) params.append('maxLifetimeValue', (parseInt(maxValue) * 100).toString())

      const response = await fetch(`/api/admin/customers?${params}`)
      if (!response.ok) throw new Error('Failed to fetch customers')

      const data = await response.json()
      setCustomers(data.customers)
      setSummary(data.summary)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [page, segment, search, minValue, maxValue])

  const handleExport = async () => {
    try {
      setExporting(true)
      const params = new URLSearchParams()
      if (segment !== 'all') params.append('segment', segment)
      if (search) params.append('search', search)
      if (minValue) params.append('minLifetimeValue', (parseInt(minValue) * 100).toString())
      if (maxValue) params.append('maxLifetimeValue', (parseInt(maxValue) * 100).toString())

      const response = await fetch(`/api/admin/customers/export?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to export customers')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'customers.csv'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export customers')
    } finally {
      setExporting(false)
    }
  }

  const sortedCustomers = useMemo(() => {
    const sorted = [...customers]
    sorted.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Customer]
      let bVal: any = b[sortBy as keyof Customer]

      if (aVal == null) aVal = 0
      if (bVal == null) bVal = 0

      const comparison = aVal > bVal ? 1 : -1
      return sortOrder === 'asc' ? comparison : -comparison
    })
    return sorted
  }, [customers, sortBy, sortOrder])

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
              <Users size={30} /> Customer Management
            </h1>
            <p className="text-slate-400 text-sm">Manage and analyze your customers</p>
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-200" onClick={() => loadCustomers()} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button
            variant="outline"
            className="border-slate-600 text-slate-200"
            onClick={handleExport}
            disabled={exporting}
          >
            <Download className="w-4 h-4 mr-2" /> {exporting ? 'Exporting...' : 'Export CSV'}
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
            <MetricCard label="Total Customers" value={summary.totalCustomers} icon={Users} color="text-blue-400" />
            <MetricCard
              label="Total Revenue"
              value={`$${(summary.totalRevenue / 100 / 1000).toFixed(1)}K`}
              icon={DollarSign}
              color="text-green-400"
            />
            <MetricCard
              label="Avg Lifetime Value"
              value={`$${(summary.averageLifetimeValue / 100).toFixed(0)}`}
              icon={TrendingUp}
              color="text-purple-400"
            />
            <MetricCard label="VIP Customers" value={summary.segmentCounts.VIP} icon={Award} color="text-yellow-400" />
          </div>
        )}

        {/* Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm text-slate-300 block mb-2">Search Customers</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Name or email"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
                />
              </div>
            </div>

            <div className="w-full md:w-40">
              <label className="text-sm text-slate-300 block mb-2">Segment</label>
              <select
                value={segment}
                onChange={(e) => {
                  setSegment(e.target.value)
                  setPage(1)
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
              >
                <option value="all">All Segments</option>
                <option value="VIP">VIP</option>
                <option value="LOYAL">Loyal</option>
                <option value="NEW">New</option>
                <option value="AT_RISK">At Risk</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="w-full md:w-32">
              <label className="text-sm text-slate-300 block mb-2">Min Value ($)</label>
              <input
                type="number"
                placeholder="0"
                value={minValue}
                onChange={(e) => {
                  setMinValue(e.target.value)
                  setPage(1)
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
              />
            </div>

            <div className="w-full md:w-32">
              <label className="text-sm text-slate-300 block mb-2">Max Value ($)</label>
              <input
                type="number"
                placeholder="Unlimited"
                value={maxValue}
                onChange={(e) => {
                  setMaxValue(e.target.value)
                  setPage(1)
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="inline-block animate-spin mb-3">
                <RefreshCw size={24} />
              </div>
              <p>Loading customers...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users size={32} className="mx-auto mb-3 opacity-50" />
              <p>No customers found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-950 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Segment</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Orders</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Lifetime Value</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Joined</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {sortedCustomers.map((customer) => {
                      const config = segmentConfig[customer.segment]
                      const SegmentIcon = config.icon

                      return (
                        <motion.tr
                          key={customer.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-slate-800/50 transition"
                        >
                          <td className="px-6 py-3">
                            <div className="font-semibold text-white">{customer.name}</div>
                            {customer.city && <div className="text-xs text-slate-400">{customer.city}, {customer.country}</div>}
                          </td>
                          <td className="px-6 py-3">
                            <div className="text-sm text-slate-300">{customer.email}</div>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <SegmentIcon size={16} className={config.color} />
                              <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm text-slate-300">{customer.totalOrders}</div>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="font-semibold text-green-400">${(customer.lifetimeValue / 100).toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-3">
                            <div className="text-sm text-slate-400">{new Date(customer.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <Link href={`/admin/customers/${customer.id}`}>
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
                  <span className="font-semibold text-white">{pagination.total}</span> total customers
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
