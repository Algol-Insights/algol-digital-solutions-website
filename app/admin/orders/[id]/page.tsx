'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit2,
  Send,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OrderDetail {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod?: string | null
  total: number
  subtotal: number
  tax: number
  shipping: number
  createdAt: string
  estimatedDelivery: string | null
  deliveredAt: string | null
  customer: {
    id: string
    name: string
    email: string
    phone: string | null
  }
  shippingAddress: {
    fullName?: string
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    phone?: string
  } | null
  orderItems: Array<{
    id: string
    productId: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      image: string | null
      sku: string
    }
    variant?: {
      id: string
      name: string
      sku: string
    } | null
  }>
}

interface TimelineEvent {
  timestamp: string
  status: string
  label: string
  description: string
}

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  PENDING: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  PROCESSING: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  SHIPPED: { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  DELIVERED: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
  CANCELLED: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
}

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingStatus, setEditingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState<string>('')

  useEffect(() => {
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      if (!response.ok) throw new Error('Failed to load order')
      const data = await response.json()
      setOrder(data)
      setNewStatus(data.status)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!order || newStatus === order.status) {
      setEditingStatus(false)
      return
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update order')

      await loadOrder()
      setEditingStatus(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order')
    }
  }

  const generateTimeline = (order: OrderDetail): TimelineEvent[] => {
    const events: TimelineEvent[] = [
      {
        timestamp: order.createdAt,
        status: 'PENDING',
        label: 'Order Placed',
        description: `Order ${order.orderNumber} was created`,
      },
    ]

    if (order.status === 'PROCESSING' || ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status)) {
      events.push({
        timestamp: new Date(new Date(order.createdAt).getTime() + 3600000).toISOString(),
        status: 'PROCESSING',
        label: 'Processing',
        description: 'Order is being prepared for shipment',
      })
    }

    if (order.status === 'SHIPPED' || ['SHIPPED', 'DELIVERED'].includes(order.status)) {
      events.push({
        timestamp: new Date(new Date(order.createdAt).getTime() + 86400000).toISOString(),
        status: 'SHIPPED',
        label: 'Shipped',
        description: `Order is on its way (Est. ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'TBD'})`,
      })
    }

    if (order.status === 'DELIVERED') {
      events.push({
        timestamp: order.deliveredAt || new Date().toISOString(),
        status: 'DELIVERED',
        label: 'Delivered',
        description: `Order delivered on ${new Date(order.deliveredAt || new Date()).toLocaleDateString()}`,
      })
    }

    if (order.status === 'CANCELLED') {
      events.push({
        timestamp: new Date().toISOString(),
        status: 'CANCELLED',
        label: 'Cancelled',
        description: 'Order was cancelled',
      })
    }

    return events
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <ShoppingBag size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-300">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={32} className="text-red-400 mx-auto mb-4" />
          <p className="text-slate-300 mb-4">{error || 'Order not found'}</p>
          <Link href="/admin/orders">
            <Button>← Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  const config = statusConfig[order.status as keyof typeof statusConfig]
  const StatusIcon = config.icon
  const timeline = generateTimeline(order)
  const address = order.shippingAddress ? JSON.parse(JSON.stringify(order.shippingAddress)) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 py-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/admin/orders" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} />
            <span>Back to Orders</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Order {order.orderNumber}</h1>
          <div className="w-20" />
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mt-6 mx-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-sm flex items-center justify-between"
        >
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-300 hover:text-red-100">
            ×
          </button>
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Status & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${config.bg}`}>
                <StatusIcon className={`w-6 h-6 ${config.color}`} />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Status</p>
                <p className={`text-lg font-bold ${config.color}`}>{order.status}</p>
              </div>
            </div>

            {editingStatus ? (
              <div className="space-y-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={handleStatusUpdate}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setEditingStatus(false)
                      setNewStatus(order.status)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setEditingStatus(true)}
                className="w-full flex items-center justify-center gap-2 mt-3 px-3 py-2 text-slate-300 hover:text-white border border-slate-700 rounded transition"
              >
                <Edit2 size={16} />
                Update Status
              </button>
            )}
          </motion.div>

          {/* Order Date */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Order Date</p>
                <p className="text-lg font-semibold text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            {order.estimatedDelivery && (
              <div className="text-sm text-slate-400">
                Est. Delivery: <span className="text-slate-200">{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
              </div>
            )}
          </motion.div>

          {/* Total */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Amount</p>
                <p className="text-lg font-bold text-green-400">${(order.total / 100).toFixed(2)}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-slate-200">${(order.subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="text-slate-200">${(order.tax / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
                <span>Shipping:</span>
                <span className="text-slate-200">${(order.shipping / 100).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900 border border-slate-800 rounded-lg p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6">Order Timeline</h2>
          <div className="space-y-6">
            {timeline.map((event, idx) => {
              const eventConfig = statusConfig[event.status as keyof typeof statusConfig]
              const EventIcon = eventConfig.icon
              const isCompleted = timeline.findIndex((e) => e.status === order.status) >= idx

              return (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-3 rounded-full ${isCompleted ? eventConfig.bg : 'bg-slate-800'}`}
                    >
                      <EventIcon className={`w-5 h-5 ${isCompleted ? eventConfig.color : 'text-slate-500'}`} />
                    </motion.div>
                    {idx < timeline.length - 1 && (
                      <div className={`w-0.5 h-12 ${isCompleted ? 'bg-green-500' : 'bg-slate-700'} my-2`} />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`font-semibold ${isCompleted ? 'text-white' : 'text-slate-400'}`}>{event.label}</p>
                    <p className="text-sm text-slate-400 mt-1">{event.description}</p>
                    <p className="text-xs text-slate-500 mt-2">{new Date(event.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Customer</h3>
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-sm">Name</p>
                <p className="text-white font-semibold">{order.customer.name}</p>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail size={16} className="text-slate-500" />
                <p className="text-sm">{order.customer.email}</p>
              </div>
              {order.customer.phone && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone size={16} className="text-slate-500" />
                  <p className="text-sm">{order.customer.phone}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Shipping Address */}
          {address && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-slate-400" />
                <h3 className="text-lg font-bold text-white">Shipping Address</h3>
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <p className="font-semibold text-white">{address.fullName || order.customer.name}</p>
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>
                {address.phone && <p className="flex items-center gap-2 mt-2"><Phone size={14} /> {address.phone}</p>}
              </div>
            </motion.div>
          )}

          {/* Payment */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Payment</h3>
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-sm">Method</p>
                <p className="text-white font-semibold capitalize">{order.paymentMethod || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Status</p>
                <p className="text-green-400 font-semibold">{order.paymentStatus}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-900 border border-slate-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Items</h3>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-800 last:border-0">
                {item.product.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded object-cover bg-slate-800"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{item.product.name}</p>
                  {item.variant && <p className="text-sm text-slate-400">{item.variant.name}</p>}
                  <p className="text-xs text-slate-500">SKU: {item.product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                  <p className="font-semibold text-white">${(item.price / 100).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
