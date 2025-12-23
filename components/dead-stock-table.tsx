'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-lib/card'
import { Badge } from '@/components/ui-lib/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui-lib/select'

interface DeadStockAlert {
  id: string
  productId: string
  daysWithoutSale: number
  lastSaleDate?: string | null
  currentStock: number
  estimatedValue: number
  status: string
  action?: string | null
  product: { id: string; name: string; sku: string; price: number; stock: number }
}

const statusColor: Record<string, string> = {
  ACTIVE: 'bg-amber-500/20 text-amber-200',
  REVIEWED: 'bg-blue-500/20 text-blue-200',
  ARCHIVED: 'bg-gray-500/20 text-gray-200',
  DELISTED: 'bg-red-500/20 text-red-200',
}

export default function DeadStockTable() {
  const [alerts, setAlerts] = useState<DeadStockAlert[]>([])
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = status ? `?status=${status}` : ''
      const res = await fetch(`/api/admin/inventory/dead-stock${params}`)
      if (!res.ok) throw new Error('Failed to load alerts')
      const data = await res.json()
      setAlerts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [status])

  const applyAction = async (id: string, action: string) => {
    try {
      const res = await fetch(`/api/admin/inventory/dead-stock/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error('Failed to update alert')
      await fetchAlerts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update alert')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="REVIEWED">Reviewed</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
              <SelectItem value="DELISTED">Delisted</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchAlerts} disabled={loading}>
            Refresh
          </Button>
        </div>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100 flex justify-between">
                <span>{alert.product.name}</span>
                <Badge className={statusColor[alert.status] || 'bg-slate-700 text-slate-100'}>{alert.status}</Badge>
              </CardTitle>
              <p className="text-xs text-slate-400">SKU: {alert.product.sku}</p>
            </CardHeader>
            <CardContent className="text-sm text-slate-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>Stock: {alert.currentStock}</div>
                <div>Value at risk: ${alert.estimatedValue.toFixed(2)}</div>
                <div>Days w/o sale: {alert.daysWithoutSale}</div>
                <div>Last sale: {alert.lastSaleDate ? new Date(alert.lastSaleDate).toLocaleDateString() : 'N/A'}</div>
              </div>
              <div className="flex gap-2 flex-wrap pt-2">
                <Button size="sm" onClick={() => applyAction(alert.id, 'DISCOUNT')}>
                  Discount
                </Button>
                <Button size="sm" variant="secondary" onClick={() => applyAction(alert.id, 'CLEARANCE')}>
                  Clearance
                </Button>
                <Button size="sm" variant="outline" onClick={() => applyAction(alert.id, 'BUNDLE')}>
                  Bundle
                </Button>
                <Button size="sm" variant="ghost" onClick={() => applyAction(alert.id, 'DONATE')}>
                  Donate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {alerts.length === 0 && !loading && (
          <div className="text-slate-400 text-sm">No dead stock alerts. Great job!</div>
        )}
      </div>
    </div>
  )
}
