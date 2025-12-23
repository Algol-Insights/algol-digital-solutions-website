'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui-lib/button';
import { motion } from 'framer-motion';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  variantDetails?: string;
  product: {
    id: string;
    name: string;
    image: string | null;
    images: string[];
    description?: string;
  };
  variant?: {
    id: string;
    name: string;
    color?: string;
    size?: string;
    storage?: string;
    image?: string;
  };
}

interface Customer {
  email: string;
  name?: string;
  phone?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  estimatedDelivery?: string;
  deliveredAt?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderItems: OrderItem[];
  customer?: Customer;
}

const orderStatusSteps = [
  { status: 'PENDING', label: 'Order Placed', icon: Clock },
  { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
  { status: 'PROCESSING', label: 'Processing', icon: Package },
  { status: 'SHIPPED', label: 'Out for Delivery', icon: Truck },
  { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

export default function OrderDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated' && orderId) {
      fetchOrder();
    }
  }, [status, orderId, router]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (response.status === 403) {
        setError('You do not have permission to view this order.');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError('Failed to load order details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'text-yellow-600';
      case 'CONFIRMED':
      case 'PROCESSING':
        return 'text-blue-600';
      case 'SHIPPED':
        return 'text-purple-600';
      case 'DELIVERED':
        return 'text-green-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCurrentStatusIndex = (status: string) => {
    const index = orderStatusSteps.findIndex((step) => step.status === status.toUpperCase());
    return index === -1 ? 0 : index;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Order</h2>
          <p className="text-gray-600 mb-4">{error || 'Order not found'}</p>
          <Link href="/order-tracking">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link href="/order-tracking" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6">
          <ArrowLeft size={20} />
          Back to Orders
        </Link>

        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Payment: {order.paymentStatus}
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="relative">
            <div className="flex justify-between mb-8">
              {orderStatusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={step.status} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      {/* Circle */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-teal-100' : ''}`}
                      >
                        <Icon size={24} />
                      </div>

                      {/* Label */}
                      <div className="mt-2 text-center">
                        <div
                          className={`text-sm font-medium ${
                            isCompleted ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {step.label}
                        </div>
                      </div>
                    </div>

                    {/* Connecting Line */}
                    {index < orderStatusSteps.length - 1 && (
                      <div
                        className={`absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2 ${
                          index < currentStatusIndex ? 'bg-teal-600' : 'bg-gray-300'
                        }`}
                        style={{ zIndex: -1 }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estimated Delivery or Delivered Date */}
          {order.deliveredAt ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <div className="font-medium text-green-900">Order Delivered</div>
                <div className="text-sm text-green-700">
                  Delivered on {formatDate(order.deliveredAt)}
                </div>
              </div>
            </div>
          ) : order.estimatedDelivery ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
              <Truck className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <div className="font-medium text-blue-900">Estimated Delivery</div>
                <div className="text-sm text-blue-700">
                  Expected by {formatDate(order.estimatedDelivery)}
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.variant?.image || item.product.image || item.product.images[0] ? (
                        <img
                          src={item.variant?.image || item.product.image || item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="text-gray-400" size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                      {item.variant && (
                        <div className="text-sm text-gray-600 mb-2">
                          Variant: {item.variant.color || ''} {item.variant.size || ''}{' '}
                          {item.variant.storage || ''}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax:</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-teal-600" />
                  Shipping Address
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            )}

            {/* Customer Information */}
            {order.customer && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-teal-600" />
                  Customer Information
                </h3>
                <div className="space-y-3">
                  {order.customer.name && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={16} className="text-gray-400" />
                      <span>{order.customer.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span>{order.customer.email}</span>
                  </div>
                  {order.customer.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} className="text-gray-400" />
                      <span>{order.customer.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-teal-600" />
                Payment Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Status:</span>
                  <span
                    className={`font-medium ${
                      order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Paid:</span>
                  <span className="font-semibold">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
