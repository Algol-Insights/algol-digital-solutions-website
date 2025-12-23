'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock, AlertCircle, Eye, ShoppingBag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui-lib/button';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string | null;
    images: string[];
  };
  variant?: {
    id: string;
    name: string;
    color?: string;
    size?: string;
    storage?: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  estimatedDelivery?: string;
  deliveredAt?: string;
  orderItems: OrderItem[];
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
}

export default function OrderTrackingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders);
      setStats(data.stats);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <Clock className="text-yellow-500" size={20} />;
      case 'CONFIRMED':
      case 'PROCESSING':
        return <Package className="text-blue-500" size={20} />;
      case 'SHIPPED':
        return <Truck className="text-purple-500" size={20} />;
      case 'DELIVERED':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'CANCELLED':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'CONFIRMED':
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter.toLowerCase());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchOrders}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History & Tracking</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Stats */}
        {stats && stats.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          >
            <button
              onClick={() => setFilter('all')}
              className={`p-4 rounded-lg border-2 transition ${
                filter === 'all'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`p-4 rounded-lg border-2 transition ${
                filter === 'pending'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`p-4 rounded-lg border-2 transition ${
                filter === 'processing'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
              <div className="text-sm text-gray-600">Processing</div>
            </button>
            <button
              onClick={() => setFilter('shipped')}
              className={`p-4 rounded-lg border-2 transition ${
                filter === 'shipped'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
              <div className="text-sm text-gray-600">Out for Delivery</div>
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`p-4 rounded-lg border-2 transition ${
                filter === 'delivered'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
              <div className="text-sm text-gray-600">Delivered</div>
            </button>
          </motion.div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <ShoppingBag className="mx-auto mb-4 text-gray-300" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start shopping to see your orders here!'
                : `You don't have any ${filter} orders.`}
            </p>
            {filter === 'all' ? (
              <Link href="/products">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  Browse Products
                </Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={() => setFilter('all')}>
                View All Orders
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          Order #{order.orderNumber}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(order.createdAt)}
                          </span>
                          <span>•</span>
                          <span>{order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                        <Link href={`/order-tracking/${order.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Eye size={16} />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {order.orderItems.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {item.product.image || item.product.images[0] ? (
                              <img
                                src={item.product.image || item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="text-gray-400" size={24} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span>Qty: {item.quantity}</span>
                              {item.variant && (
                                <span>
                                  • {item.variant.color || ''} {item.variant.size || ''} {item.variant.storage || ''}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      ))}
                      {order.orderItems.length > 2 && (
                        <div className="text-sm text-gray-600 text-center pt-2">
                          +{order.orderItems.length - 2} more {order.orderItems.length - 2 === 1 ? 'item' : 'items'}
                        </div>
                      )}
                    </div>

                    {/* Order Total */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-gray-600">Order Total:</span>
                      <span className="text-xl font-bold text-gray-900">
                        {formatCurrency(order.total)}
                      </span>
                    </div>

                    {/* Estimated Delivery */}
                    {order.estimatedDelivery && order.status !== 'DELIVERED' && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm">
                        <Truck className="text-blue-600 flex-shrink-0" size={18} />
                        <span className="text-blue-900">
                          Estimated delivery: <strong>{formatDate(order.estimatedDelivery)}</strong>
                        </span>
                      </div>
                    )}

                    {/* Delivered */}
                    {order.deliveredAt && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm">
                        <CheckCircle className="text-green-600 flex-shrink-0" size={18} />
                        <span className="text-green-900">
                          Delivered on <strong>{formatDate(order.deliveredAt)}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
