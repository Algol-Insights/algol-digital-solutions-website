"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, Truck, CheckCircle, Clock, Search, Eye, AlertCircle } from "lucide-react"
import { useSession } from "next-auth/react"

interface OrderItem {
  id: string
  product: {
    id: string
    name: string
    image?: string
  }
  quantity: number
  price: number
}

interface Order {
  id: string
  createdAt: string
  status: string
  shippingAddress?: string
  shippingCity?: string
  orderItems: OrderItem[]
  trackingNumber?: string
}

const statusConfig: Record<string, any> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "text-gray-400",
    bg: "bg-gray-400/10",
    border: "border-gray-400/30"
  },
  PROCESSING: {
    label: "Processing",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30"
  },
  SHIPPED: {
    label: "Shipped",
    icon: Truck,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30"
  },
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30"
  },
  CANCELLED: {
    label: "Cancelled",
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30"
  }
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status])

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.orderItems.some(item => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal-medium mx-auto mb-4"></div>
          <p className="text-slate-400">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please sign in to view your orders</p>
          <Link href="/auth/login" className="text-brand-teal-medium hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/account"
            className="inline-flex items-center gap-2 text-brand-teal-medium hover:text-brand-golden transition-colors mb-4"
          >
            ← Back to Account
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-teal-medium to-brand-golden bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-slate-400">View and track your order history</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-medium/50 focus:border-brand-teal-medium transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig]
              const StatusIcon = status.icon
              const isExpanded = selectedOrder === order.id

              return (
                <div
                  key={order.id}
                  className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden hover:border-brand-teal-medium/30 transition-all"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1.5 ${status.bg} ${status.color} ${status.border} border`}>
                            <StatusIcon className="w-4 h-4" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm">
                          Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="text-2xl font-bold text-brand-golden">${order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</div>
                        <p className="text-slate-400 text-sm">{order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 mb-4">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm py-2 border-t border-slate-700/30">
                          <span className="text-slate-300">{item.quantity}x {item.product.name}</span>
                          <span className="text-slate-400 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tracking & Address */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-700/30 space-y-3">
                        {order.shippingAddress && (
                          <div className="bg-slate-700/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Package className="w-4 h-4 text-brand-teal-medium" />
                              <span className="text-sm font-medium">Delivery Address</span>
                            </div>
                            <p className="text-slate-300">{order.shippingAddress}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      <Link
                        href={`/order-confirmation?orderId=${order.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-teal-medium/10 text-brand-teal-medium border border-brand-teal-medium/30 rounded-lg hover:bg-brand-teal-medium/20 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                      {order.status === 'DELIVERED' && (
                        <Link
                          href={`/products`}
                          className="flex items-center gap-2 px-4 py-2 bg-brand-golden/10 text-brand-golden border border-brand-golden/30 rounded-lg hover:bg-brand-golden/20 transition-colors"
                        >
                          Buy Again
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Orders Found</h3>
            <p className="text-slate-400 mb-6">
              {searchQuery ? `No orders match "${searchQuery}"` : "You haven't placed any orders yet"}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-brand-teal-medium text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal-dark transition-colors"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <h3 className="text-xl font-bold mb-4">Need Help with Your Order?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/support"
              className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <h4 className="font-bold mb-1">Contact Support</h4>
              <p className="text-sm text-slate-400">Get help from our team</p>
            </Link>
            <Link
              href="/returns"
              className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <h4 className="font-bold mb-1">Return an Item</h4>
              <p className="text-sm text-slate-400">Start a return process</p>
            </Link>
            <Link
              href="/faqs"
              className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <h4 className="font-bold mb-1">FAQs</h4>
              <p className="text-sm text-slate-400">Find quick answers</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
