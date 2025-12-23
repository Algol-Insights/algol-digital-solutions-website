'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-lib/card'
import { Badge } from '@/components/ui-lib/badge'
import { Button } from '@/components/ui/button'

interface VelocityItem {
  productId: string
  product?: { id: string; name: string; sku?: string; price?: number }
  daily: number
  weekly: number
  monthly: number
  variance: number
  updatedAt: string
}

interface RecommendationItem {
  productId: string
  product?: { id: string; name: string; sku?: string; stock?: number }
  recommendedStock: number
  reorderPoint: number
  safetyStock: number
  confidence: number
  updatedAt: string
}

interface StatsPayload {
  velocityLeaderboard: VelocityItem[]
  recommendations: RecommendationItem[]
}

export default function ForecastingOverview() {
  const [stats, setStats] = useState<StatsPayload | null>(null)
  const [loading, setLoading] = useState(false)

  const maxDaily = useMemo(() =>
    stats?.velocityLeaderboard.reduce((m, v) => Math.max(m, v.daily), 0) || 1,
  [stats])

  const maxReorder = useMemo(() =>
    stats?.recommendations.reduce((m, r) => Math.max(m, r.reorderPoint), 0) || 1,
  [stats])

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/inventory/automation/stats')
      if (!res.ok) throw new Error('Failed to load stats')
      const data = await res.json()
      setStats({
        velocityLeaderboard: data.velocityLeaderboard || [],
        recommendations: data.recommendations || [],
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Velocity Leaders</CardTitle>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>Refresh</Button>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-200">
          {(!stats || stats.velocityLeaderboard.length === 0) && (
            <p className="text-slate-400 text-sm">No velocity data yet.</p>
          )}
          {stats?.velocityLeaderboard.map((item) => {
            const width = Math.max(8, (item.daily / maxDaily) * 100)
            return (
              <div key={item.productId} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">{item.product?.name || 'Product'}</span>
                  <span>Daily {item.daily.toFixed(2)}</span>
                </div>
                <div className="h-2 rounded bg-slate-800">
                  <div
                    className="h-2 rounded bg-emerald-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <div className="flex gap-2 text-xs text-slate-400">
                  <Badge variant="outline">Weekly {item.weekly.toFixed(1)}</Badge>
                  <Badge variant="outline">Monthly {item.monthly.toFixed(1)}</Badge>
                  <Badge variant="outline">Var {item.variance.toFixed(2)}</Badge>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Top Recommendations</CardTitle>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>Refresh</Button>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-200">
          {(!stats || stats.recommendations.length === 0) && (
            <p className="text-slate-400 text-sm">No recommendations generated yet.</p>
          )}
          {stats?.recommendations.map((rec) => {
            const width = Math.max(8, (rec.reorderPoint / maxReorder) * 100)
            return (
              <div key={rec.productId} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">{rec.product?.name || 'Product'}</span>
                  <span>Reorder {rec.reorderPoint}</span>
                </div>
                <div className="h-2 rounded bg-slate-800">
                  <div
                    className="h-2 rounded bg-sky-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <div className="flex gap-2 text-xs text-slate-400 flex-wrap">
                  <Badge variant="outline">Recommended {rec.recommendedStock}</Badge>
                  <Badge variant="outline">Safety {rec.safetyStock}</Badge>
                  <Badge variant="outline">Confidence {(rec.confidence * 100).toFixed(0)}%</Badge>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
