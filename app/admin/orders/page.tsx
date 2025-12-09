'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Package, Truck, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface Order {
  id: string
  customer: string
  email: string
  items: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered'
  date: string
  lastUpdate: string
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    items: 1,
    total: 1999.99,
    status: 'pending',
    date: '2024-01-15',
    lastUpdate: '2024-01-15 10:30',
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    items: 2,
    total: 1249.98,
    status: 'confirmed',
    date: '2024-01-14',
    lastUpdate: '2024-01-14 15:45',
  },
  {
    id: 'ORD-003',
    customer: 'Bob Johnson',
    email: 'bob@example.com',
    items: 1,
    total: 799.99,
    status: 'processing',
    date: '2024-01-13',
    lastUpdate: '2024-01-13 09:20',
  },
  {
    id: 'ORD-004',
    customer: 'Alice Williams',
    email: 'alice@example.com',
    items: 3,
    total: 1849.97,
    status: 'shipped',
    date: '2024-01-10',
    lastUpdate: '2024-01-12 14:00 - Shipped with FedEx',
  },
  {
    id: 'ORD-005',
    customer: 'Charlie Brown',
    email: 'charlie@example.com',
    items: 1,
    total: 399.99,
    status: 'delivered',
    date: '2024-01-05',
    lastUpdate: '2024-01-08 16:30 - Delivered',
  },
]

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Confirmed' },
  processing: { icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Delivered' },
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 py-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="text-slate-400 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <ShoppingBag size={36} />
            Order Management
          </h1>
          <p className="text-slate-400 mt-1">Process and track customer orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-slate-500 text-xs mt-2">All time</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
              <Clock size={16} className="text-yellow-400" />
              Pending
            </p>
            <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
            <p className="text-slate-500 text-xs mt-2">Need review</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
              <Package size={16} className="text-purple-400" />
              Processing
            </p>
            <p className="text-3xl font-bold text-purple-400">{stats.processing}</p>
            <p className="text-slate-500 text-xs mt-2">Being packed</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
              <Truck size={16} className="text-green-400" />
              Shipped
            </p>
            <p className="text-3xl font-bold text-green-400">{stats.shipped}</p>
            <p className="text-slate-500 text-xs mt-2">In transit</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-400">${stats.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            <p className="text-slate-500 text-xs mt-2">From orders</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Search Orders</label>
              <input
                type="text"
                placeholder="Search by ID, customer, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Items</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const config = statusConfig[order.status]
                  const StatusIcon = config.icon
                  return (
                    <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4">
                        <p className="text-white font-semibold">{order.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{order.customer}</p>
                        <p className="text-slate-500 text-xs">{order.email}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{order.items} item{order.items > 1 ? 's' : ''}</td>
                      <td className="px-6 py-4 text-right text-white font-semibold">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
                          <StatusIcon size={14} />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-300 text-sm">{order.date}</p>
                        <p className="text-slate-500 text-xs">{order.lastUpdate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-400 hover:text-blue-300 font-semibold text-sm flex items-center gap-1">
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
