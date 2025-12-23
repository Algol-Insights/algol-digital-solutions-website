'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui-lib/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-lib/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui-lib/select'

interface ReorderTask {
  id: string
  productId: string
  supplierId?: string
  quantity: number
  status: string
  reorderPoint: number
  reason: string
  expectedAt?: string
  cost?: number
  createdAt: string
  product: { id: string; name: string; sku: string }
  supplier?: { id: string; name: string }
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-500/20 text-amber-200',
  ORDERED: 'bg-blue-500/20 text-blue-200',
  RECEIVED: 'bg-green-500/20 text-green-200',
  CANCELLED: 'bg-gray-500/20 text-gray-200',
}

export default function ReorderTaskList() {
  const [tasks, setTasks] = useState<ReorderTask[]>([])
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = status ? `?status=${status}` : ''
      const res = await fetch(`/api/admin/inventory/reorder-tasks${params}`)
      if (!res.ok) throw new Error('Failed to load tasks')
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [status])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/inventory/reorder-tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update task')
      await fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
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
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ORDERED">Ordered</SelectItem>
              <SelectItem value="RECEIVED">Received</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchTasks} disabled={loading}>
            Refresh
          </Button>
        </div>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle className="text-lg text-slate-100 flex justify-between">
                <span>{task.product.name}</span>
                <Badge className={statusColors[task.status] || 'bg-slate-700 text-slate-100'}>
                  {task.status}
                </Badge>
              </CardTitle>
              <p className="text-xs text-slate-400">SKU: {task.product.sku}</p>
            </CardHeader>
            <CardContent className="text-sm text-slate-200 space-y-2">
              <div className="flex gap-3 flex-wrap text-slate-300">
                <span>Qty: <strong>{task.quantity}</strong></span>
                <span>Reorder Point: <strong>{task.reorderPoint}</strong></span>
                <span>Reason: {task.reason}</span>
              </div>
              <div className="text-slate-300">
                Supplier: {task.supplier?.name || 'Unassigned'}
              </div>
              <div className="text-slate-400 text-xs">Expected: {task.expectedAt ? new Date(task.expectedAt).toLocaleDateString() : 'n/a'}</div>
              {task.cost && <div className="text-slate-400 text-xs">Est. Cost: ${task.cost.toFixed(2)}</div>}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="secondary" onClick={() => updateStatus(task.id, 'ORDERED')}>
                  Mark Ordered
                </Button>
                <Button size="sm" variant="outline" onClick={() => updateStatus(task.id, 'RECEIVED')}>
                  Mark Received
                </Button>
                <Button size="sm" variant="ghost" onClick={() => updateStatus(task.id, 'CANCELLED')}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {tasks.length === 0 && !loading && (
          <div className="text-slate-400 text-sm">No reorder tasks found.</div>
        )}
      </div>
    </div>
  )
}
