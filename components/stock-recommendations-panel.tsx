'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-lib/card'
import { Badge } from '@/components/ui-lib/badge'

interface Recommendation {
  id: string
  productId: string
  recommendedStock: number
  minStock: number
  maxStock: number
  safetyStock: number
  reorderPoint: number
  forecastedVelocity: number
  leadTimeVariance?: number
  confidence: number
  appliedAt?: string | null
  product: {
    id: string
    name: string
    sku: string
    stock: number
    price: number
  }
}

export default function StockRecommendationsPanel() {
  const [items, setItems] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [minDiff, setMinDiff] = useState(0)

  const fetchRecommendations = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = minDiff > 0 ? `?minDifference=${minDiff}` : ''
      const res = await fetch(`/api/admin/inventory/recommendations${params}`)
      if (!res.ok) throw new Error('Failed to load recommendations')
      const data = await res.json()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [minDiff])

  const generateAll = async () => {
    setLoading(true)
    try {
      await fetch('/api/admin/inventory/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generateAll: true }),
      })
      await fetchRecommendations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations')
    } finally {
      setLoading(false)
    }
  }

  const apply = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/inventory/recommendations/${productId}/apply`, {
        method: 'PUT',
      })
      if (!res.ok) throw new Error('Failed to apply recommendation')
      await fetchRecommendations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply recommendation')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Stock Recommendations</h2>
          <p className="text-sm text-slate-400">Generate and apply optimal stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-48 space-y-1">
            <label className="text-xs text-slate-400">Min difference filter ({minDiff}+ units)</label>
            <input
              type="range"
              min={0}
              max={200}
              step={10}
              value={minDiff}
              onChange={(e) => setMinDiff(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <Button variant="outline" size="sm" onClick={fetchRecommendations} disabled={loading}>Refresh</Button>
          <Button size="sm" onClick={generateAll} disabled={loading}>Generate All</Button>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((rec) => (
          <Card key={rec.id} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100 flex justify-between">
                <span>{rec.product.name}</span>
                {rec.appliedAt ? (
                  <Badge variant="outline">Applied</Badge>
                ) : (
                  <Badge variant="secondary">Pending</Badge>
                )}
              </CardTitle>
              <p className="text-xs text-slate-400">SKU: {rec.product.sku}</p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <div>Current: <strong>{rec.product.stock}</strong></div>
                <div>Recommended: <strong>{rec.recommendedStock}</strong></div>
                <div>Min: {rec.minStock}</div>
                <div>Max: {rec.maxStock}</div>
                <div>Safety: {rec.safetyStock}</div>
                <div>ROP: {rec.reorderPoint}</div>
                <div>Velocity: {rec.forecastedVelocity.toFixed(2)} /day</div>
                <div>Confidence: {(rec.confidence * 100).toFixed(0)}%</div>
              </div>
              <div className="flex gap-2 pt-2">
                {!rec.appliedAt && (
                  <Button size="sm" onClick={() => apply(rec.productId)}>
                    Apply
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => alert('EOQ and details coming soon')}>
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && !loading && (
          <div className="text-slate-400 text-sm">No recommendations yet. Generate to begin.</div>
        )}
      </div>
    </div>
  )
}
