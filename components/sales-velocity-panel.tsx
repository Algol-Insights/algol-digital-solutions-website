'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-lib/card'
import { Input } from '@/components/ui-lib/input'
import { Badge } from '@/components/ui-lib/badge'

interface Velocity {
  id: string
  productId: string
  dailyVelocity: number
  weeklyVelocity: number
  monthlyVelocity: number
  varianceDailyDemand: number
  lastUpdated: string
  product?: { name: string; price: number; sku?: string }
}

export default function SalesVelocityPanel() {
  const [productId, setProductId] = useState('')
  const [velocity, setVelocity] = useState<Velocity | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const fetchVelocity = async () => {
    if (!productId) return
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/inventory/sales-velocity/${productId}`)
      if (!res.ok) throw new Error('Velocity not found')
      const data = await res.json()
      setVelocity(data)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to load velocity')
      setVelocity(null)
    } finally {
      setLoading(false)
    }
  }

  const calculateAll = async () => {
    setLoading(true)
    setMessage(null)
    try {
      await fetch('/api/admin/inventory/sales-velocity/calculate', { method: 'POST' })
      setMessage('Velocities recalculated')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to calculate')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // noop init
  }, [])

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <CardTitle className="text-lg text-slate-100">Sales Velocity</CardTitle>
        <div className="flex gap-2">
          <Input
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-56"
          />
          <Button onClick={fetchVelocity} disabled={loading}>Fetch</Button>
          <Button variant="outline" onClick={calculateAll} disabled={loading}>Recalculate All</Button>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-slate-200 space-y-2">
        {message && <p className="text-xs text-slate-400">{message}</p>}
        {velocity ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-800 rounded">
              <div className="text-xs text-slate-400">Daily</div>
              <div className="text-lg font-semibold">{velocity.dailyVelocity.toFixed(2)}</div>
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <div className="text-xs text-slate-400">Weekly</div>
              <div className="text-lg font-semibold">{velocity.weeklyVelocity.toFixed(1)}</div>
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <div className="text-xs text-slate-400">Monthly</div>
              <div className="text-lg font-semibold">{velocity.monthlyVelocity.toFixed(1)}</div>
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <div className="text-xs text-slate-400">Demand Variance</div>
              <div className="text-lg font-semibold">{velocity.varianceDailyDemand.toFixed(2)}</div>
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <div className="text-xs text-slate-400">Product</div>
              <div className="font-semibold">{velocity.product?.name || 'N/A'}</div>
              {velocity.product?.sku && <div className="text-xs text-slate-400">{velocity.product.sku}</div>}
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <div className="text-xs text-slate-400">Last Updated</div>
              <div className="text-sm">{new Date(velocity.lastUpdated).toLocaleString()}</div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">Enter a product ID to view velocity.</p>
        )}
        {velocity && (
          <div className="flex gap-2 pt-2 flex-wrap">
            <Badge variant="outline">Forecast/day: {velocity.dailyVelocity.toFixed(2)}</Badge>
            <Badge variant="outline">Monthly Rev: ${(velocity.monthlyVelocity * (velocity.product?.price || 0)).toFixed(2)}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
