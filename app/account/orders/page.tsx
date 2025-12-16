"use client"

import { useState } from "react"
import Link from "next/link"
import { Package, Truck, CheckCircle, Clock, Search, Eye } from "lucide-react"

// Mock data - in production, this would come from API
const mockOrders = [
  {
    id: "ORD-2025-001",
    date: "2025-12-10",
    status: "delivered",
    total: 1250.00,
    items: [
      { name: "Dell Latitude 5420 Business Laptop", quantity: 1, price: 1200.00 },
      { name: "Laptop Bag", quantity: 1, price: 50.00 }
    ],
    tracking: "TRK-ZW-12345",
    deliveryAddress: "15 Borrowdale Road, Harare"
  },
  {
    id: "ORD-2025-002",
    date: "2025-12-08",
    status: "in-transit",
    total: 850.00,
    items: [
      { name: "Hikvision 8CH CCTV System", quantity: 1, price: 850.00 }
    ],
    tracking: "TRK-ZW-12346",
    deliveryAddress: "45 Samora Machel Avenue, Harare"
  },
  {
    id: "ORD-2025-003",
    date: "2025-12-05",
    status: "processing",
    total: 450.00,
    items: [
      { name: "TP-Link Archer Router", quantity: 2, price: 200.00 },
      { name: "Network Cable (50m)", quantity: 1, price: 50.00 }
    ],
    tracking: null,
    deliveryAddress: "10 Mutare Road, Harare"
  }
]

const statusConfig = {
  processing: {
    label: "Processing",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30"
  },
  "in-transit": {
    label: "In Transit",
    icon: Truck,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30"
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30"
  }
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const filteredOrders = mockOrders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

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
                          Ordered on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="text-2xl font-bold text-brand-golden">${order.total.toFixed(2)}</div>
                        <p className="text-slate-400 text-sm">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm py-2 border-t border-slate-700/30">
                          <span className="text-slate-300">{item.quantity}x {item.name}</span>
                          <span className="text-slate-400 font-medium">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tracking & Address */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-700/30 space-y-3">
                        {order.tracking && (
                          <div className="bg-slate-700/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Truck className="w-4 h-4 text-brand-teal-medium" />
                              <span className="text-sm font-medium">Tracking Number</span>
                            </div>
                            <p className="text-brand-teal-medium font-mono">{order.tracking}</p>
                          </div>
                        )}
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Package className="w-4 h-4 text-brand-teal-medium" />
                            <span className="text-sm font-medium">Delivery Address</span>
                          </div>
                          <p className="text-slate-300">{order.deliveryAddress}</p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button
                        onClick={() => setSelectedOrder(isExpanded ? null : order.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-teal-medium/10 text-brand-teal-medium border border-brand-teal-medium/30 rounded-lg hover:bg-brand-teal-medium/20 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </button>
                      {order.tracking && (
                        <Link
                          href={`/order-tracking?tracking=${order.tracking}`}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-white border border-slate-600/50 rounded-lg hover:bg-slate-600/50 transition-colors"
                        >
                          <Truck className="w-4 h-4" />
                          Track Order
                        </Link>
                      )}
                      {order.status === 'delivered' && (
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
