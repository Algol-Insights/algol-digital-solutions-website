'use client';

import { useState } from 'react';
import { Bell, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui-lib/button';
import { Input } from '@/components/ui-lib/input';

interface StockAlertButtonProps {
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  inStock: boolean;
  userEmail?: string;
}

export function StockAlertButton({
  productId,
  variantId,
  productName,
  variantName,
  inStock,
  userEmail,
}: StockAlertButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState(userEmail || '');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  // Don't show if product is in stock
  if (inStock) {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stock-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          productId: variantId ? null : productId,
          variantId: variantId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSubscribed(true);
      setShowForm(false);

      // Reset after 3 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
        <Check className="h-5 w-5" />
        <span className="font-medium">You'll be notified when this item is back in stock!</span>
      </div>
    );
  }

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border-teal-600 text-teal-600 hover:bg-teal-50"
      >
        <Bell className="h-5 w-5" />
        Notify Me When Available
      </Button>
    );
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-blue-900">
          <Bell className="h-5 w-5" />
          <span className="font-medium">Get Stock Alert</span>
        </div>
        <button
          onClick={() => {
            setShowForm(false);
            setError('');
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <p className="text-sm text-blue-700 mb-3">
        Enter your email to be notified when{' '}
        <strong>
          {productName}
          {variantName ? ` (${variantName})` : ''}
        </strong>{' '}
        is back in stock.
      </p>

      <form onSubmit={handleSubscribe} className="space-y-3">
        <Input
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white"
        />

        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X className="h-4 w-4" />
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Subscribing...
            </>
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Subscribe to Alert
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-blue-600 mt-2">
        We'll send you a single email when this item is back in stock. No spam!
      </p>
    </div>
  );
}
