'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-lib/card'
import { Input } from '@/components/ui-lib/input'

export default function AutoReorderTrigger() {
  const [productId, setProductId] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const trigger = async () => {
    if (!productId) return
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/inventory/reorder-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, reason: 'MANUAL' }),
      })
      if (!res.ok) throw new Error('Failed to create reorder task')
      setMessage('Reorder task created')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg text-slate-100">Manual Reorder Trigger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-200">
        <Input
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={trigger} disabled={loading || !productId}>Trigger</Button>
          <Button variant="outline" onClick={() => setProductId('')} disabled={loading}>Clear</Button>
        </div>
        {message && <p className="text-xs text-slate-400">{message}</p>}
      </CardContent>
    </Card>
  )
}
