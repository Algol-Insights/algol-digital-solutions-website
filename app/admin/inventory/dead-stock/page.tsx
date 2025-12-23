'use client'

import DeadStockTable from '@/components/dead-stock-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-lib/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function DeadStockPage() {
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const detect = async () => {
    setRunning(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/inventory/dead-stock', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to run detection')
      const data = await res.json()
      setMessage(`Alerts created: ${data.created}, updated: ${data.updated}`)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to detect')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Dead Stock</h1>
            <p className="text-slate-400 text-sm">Identify products without sales and plan actions.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={detect} disabled={running}>{running ? 'Running...' : 'Detect Now'}</Button>
          </div>
        </div>

        {message && (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="text-sm text-slate-200 p-4">{message}</CardContent>
          </Card>
        )}

        <DeadStockTable />
      </div>
    </div>
  )
}
