'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Package, Truck, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react'

interface OrderStatus {
  id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  timestamp: string
}

interface Order {
  id: string
  orderDate: string
  customerName: string
  email: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  paymentStatus: 'pending' | 'paid' | 'failed'
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  statusHistory: OrderStatus[]
  trackingNumber?: string
  estimatedDelivery?: string
}

const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    orderDate: '2024-12-08',
    customerName: 'John Doe',
    email: 'john@example.com',
    items: [
      { id: 'prod-1', name: 'Premium Laptop Pro', quantity: 1, price: 1999.99 },
    ],
    subtotal: 1999.99,
    tax: 319.99,
    shipping: 50.00,
    total: 2369.98,
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    trackingNumber: 'SHIP-2024-12345',
    estimatedDelivery: '2024-12-15',
    statusHistory: [
      { id: '1', status: 'pending', timestamp: '2024-12-08T10:00:00' },
      { id: '2', status: 'processing', timestamp: '2024-12-09T14:30:00' },
      { id: '3', status: 'shipped', timestamp: '2024-12-10T08:15:00' },
    ],
  },
  {
    id: 'ORD-2024-002',
    orderDate: '2024-12-07',
    customerName: 'Jane Smith',
    email: 'jane@example.com',
    items: [
      { id: 'prod-2', name: 'Gaming Monitor', quantity: 1, price: 599.99 },
      { id: 'prod-3', name: 'Wireless Headphones', quantity: 1, price: 249.99 },
    ],
    subtotal: 849.98,
    tax: 135.98,
    shipping: 30.00,
    total: 1015.96,
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    trackingNumber: 'SHIP-2024-12346',
    estimatedDelivery: '2024-12-12',
    statusHistory: [
      { id: '1', status: 'pending', timestamp: '2024-12-07T11:20:00' },
      { id: '2', status: 'processing', timestamp: '2024-12-07T16:45:00' },
      { id: '3', status: 'shipped', timestamp: '2024-12-08T09:00:00' },
      { id: '4', status: 'delivered', timestamp: '2024-12-12T14:20:00' },
    ],
  },
]

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
  cancelled: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
}

export default function OrderTrackingPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchId, setSearchId] = useState('')

  const filteredOrders = mockOrders.filter((order) =>
    order.id.toLowerCase().includes(searchId.toLowerCase()) ||
    order.email.toLowerCase().includes(searchId.toLowerCase()),
  )

  const displayOrders = searchId ? filteredOrders : mockOrders

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-8">
          <Link href="/digital-solutions" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Store
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="w-8 h-8" />
            Track Your Orders
          </h1>
          <p className="text-muted-foreground mt-2">View your order status and delivery information</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search */}
        <div className="mb-8 max-w-md">
          <input
            type="text"
            placeholder="Search by order ID or email..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            {displayOrders.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="text-muted-foreground">No orders found</p>
              </div>
            ) : (
              displayOrders.map((order) => {
                const config = statusConfig[order.orderStatus]
                const StatusIcon = config.icon

                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedOrder?.id === order.id
                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-950'
                        : 'border-border hover:border-violet-400 bg-card'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{order.id}</p>
                        <p className="text-xs text-muted-foreground mt-1">{order.orderDate}</p>
                      </div>
                      <StatusIcon className={`w-4 h-4 flex-shrink-0 ${config.color}`} />
                    </div>
                    <p className="text-sm font-medium text-foreground">${order.total.toFixed(2)}</p>
                    <p className={`text-xs font-semibold mt-1 ${config.color}`}>{config.label}</p>
                  </button>
                )
              })
            )}
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Order Header */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedOrder.id}</h2>
                      <p className="text-muted-foreground mt-1">Order placed on {selectedOrder.orderDate}</p>
                    </div>
                    <div className="text-right">
                      {(() => {
                        const config = statusConfig[selectedOrder.orderStatus]
                        const StatusIcon = config.icon
                        return (
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {config.label}
                          </span>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-sm font-semibold">{selectedOrder.customerName}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-6">Order Timeline</h3>
                  <div className="space-y-4">
                    {selectedOrder.statusHistory.map((status, index) => {
                      const config = statusConfig[status.status]
                      const StatusIcon = config.icon
                      const isLast = index === selectedOrder.statusHistory.length - 1

                      return (
                        <div key={status.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
                              <StatusIcon className={`w-5 h-5 ${config.color}`} />
                            </div>
                            {!isLast && <div className="w-0.5 h-12 bg-border my-2" />}
                          </div>
                          <div className="pt-1 pb-4">
                            <p className="font-semibold text-foreground capitalize">{status.status}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(status.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Tracking Info */}
                {selectedOrder.trackingNumber && selectedOrder.orderStatus === 'shipped' && (
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Tracking Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">Tracking Number:</span>
                        <span className="font-mono font-semibold text-foreground">{selectedOrder.trackingNumber}</span>
                      </div>
                      {selectedOrder.estimatedDelivery && (
                        <div className="flex justify-between">
                          <span className="text-blue-700 dark:text-blue-300">Estimated Delivery:</span>
                          <span className="font-semibold text-foreground">{selectedOrder.estimatedDelivery}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-foreground">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax:</span>
                      <span className="font-medium">${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span className="font-medium">${selectedOrder.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                      <span>Total:</span>
                      <span className="text-violet-600">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div
                  className={`rounded-lg p-4 text-sm ${
                    selectedOrder.paymentStatus === 'paid'
                      ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-100'
                      : selectedOrder.paymentStatus === 'pending'
                        ? 'bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100'
                        : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-100'
                  }`}
                >
                  <p className="font-semibold mb-1">Payment Status: {selectedOrder.paymentStatus.toUpperCase()}</p>
                  {selectedOrder.paymentStatus === 'pending' && (
                    <p>Your payment is being processed. This typically takes 1-3 business days.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
