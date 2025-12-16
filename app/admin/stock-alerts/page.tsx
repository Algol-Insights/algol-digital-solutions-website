'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Send, Trash2, RefreshCw, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui-lib/button';

interface StockAlert {
  id: string;
  email: string;
  productId: string | null;
  variantId: string | null;
  notified: boolean;
  notifiedAt: string | null;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    stock: number;
    inStock: boolean;
  };
  variant?: {
    id: string;
    name: string;
    stock: number;
    inStock: boolean;
  };
}

export default function AdminStockAlertsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'notified'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated' && session?.user) {
      if ((session.user as any).role !== 'admin') {
        router.push('/');
      } else {
        fetchAlerts();
      }
    }
  }, [status, session, router]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stock-alerts');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendNotifications = async (productId?: string, variantId?: string) => {
    const key = `${productId || ''}-${variantId || ''}`;
    setSending(key);

    try {
      const response = await fetch('/api/stock-alerts/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId || null,
          variantId: variantId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send notifications');
      }

      alert(`Notifications sent: ${data.message}`);
      fetchAlerts(); // Refresh the list
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert(error instanceof Error ? error.message : 'Failed to send notifications');
    } finally {
      setSending(null);
    }
  };

  const deleteAlert = async (alertId: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;

    try {
      const response = await fetch(`/api/stock-alerts/${alertId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete alert');
      }

      fetchAlerts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting alert:', error);
      alert('Failed to delete alert');
    }
  };

  const groupedAlerts = alerts.reduce((acc, alert) => {
    const key = alert.variantId || alert.productId || 'unknown';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(alert);
    return acc;
  }, {} as Record<string, StockAlert[]>);

  const filteredAlerts = Object.entries(groupedAlerts).filter(([_, alertsList]) => {
    if (filter === 'pending') return alertsList.some((a) => !a.notified);
    if (filter === 'notified') return alertsList.every((a) => a.notified);
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading stock alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Alert Management</h1>
          <p className="text-gray-600">Manage and send notifications for out-of-stock products</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">
              {Object.keys(groupedAlerts).length}
            </div>
            <div className="text-sm text-gray-600">Total Products with Alerts</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {alerts.filter((a) => !a.notified).length}
            </div>
            <div className="text-sm text-gray-600">Pending Notifications</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter((a) => a.notified).length}
            </div>
            <div className="text-sm text-gray-600">Notifications Sent</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({Object.keys(groupedAlerts).length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'pending'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pending (
            {
              Object.entries(groupedAlerts).filter(([_, alertsList]) =>
                alertsList.some((a) => !a.notified)
              ).length
            }
            )
          </button>
          <button
            onClick={() => setFilter('notified')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'notified'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Notified (
            {
              Object.entries(groupedAlerts).filter(([_, alertsList]) =>
                alertsList.every((a) => a.notified)
              ).length
            }
            )
          </button>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Bell className="mx-auto mb-4 text-gray-300" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Stock Alerts</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No stock alerts have been created yet.'
                : filter === 'pending'
                ? 'No pending alerts to send.'
                : 'No notified alerts.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map(([key, alertsList]) => {
              const firstAlert = alertsList[0];
              const product = firstAlert.product;
              const variant = firstAlert.variant;
              const pendingCount = alertsList.filter((a) => !a.notified).length;
              const notifiedCount = alertsList.filter((a) => a.notified).length;
              const isInStock = variant ? variant.inStock : product?.inStock;
              const stock = variant ? variant.stock : product?.stock || 0;

              return (
                <div key={key} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {product?.name || 'Unknown Product'}
                        {variant && <span className="text-gray-600"> - {variant.name}</span>}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span
                          className={`inline-flex items-center gap-1 ${
                            isInStock ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              isInStock ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          {isInStock ? `In Stock (${stock})` : 'Out of Stock'}
                        </span>
                        <span className="text-gray-600">
                          {pendingCount} pending • {notifiedCount} notified
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {pendingCount > 0 && isInStock && (
                        <Button
                          onClick={() =>
                            sendNotifications(firstAlert.productId || undefined, firstAlert.variantId || undefined)
                          }
                          disabled={sending === key}
                          className="bg-teal-600 hover:bg-teal-700"
                          size="sm"
                        >
                          {sending === key ? (
                            <>
                              <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Notify ({pendingCount})
                            </>
                          )}
                        </Button>
                      )}
                      {!isInStock && pendingCount > 0 && (
                        <div className="text-sm text-yellow-600 font-medium flex items-center gap-1">
                          <AlertCircle size={16} />
                          Out of stock
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subscribers List */}
                  <div className="space-y-2">
                    {alertsList.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {alert.notified ? (
                            <CheckCircle className="text-green-600" size={20} />
                          ) : (
                            <Bell className="text-yellow-600" size={20} />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{alert.email}</div>
                            <div className="text-xs text-gray-600">
                              {alert.notified
                                ? `Notified on ${formatDate(alert.notifiedAt!)}`
                                : `Subscribed on ${formatDate(alert.createdAt)}`}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                          title="Delete alert"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
