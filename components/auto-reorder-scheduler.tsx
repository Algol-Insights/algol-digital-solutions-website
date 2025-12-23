'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-lib/card'
import { Badge } from '@/components/ui-lib/badge'

interface SweepResult {
  checked: number
  reordered: number
  failed: number
  runAt: string
}

export default function AutoReorderScheduler() {
  const [result, setResult] = useState<SweepResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runSweep = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/inventory/automation/trigger', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to run auto-reorder')
      setResult(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run auto-reorder')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="text-lg text-slate-100">Auto-Reorder Scheduler</CardTitle>
        <p className="text-xs text-slate-400">Run a full sweep or call this endpoint from your cron runner.</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-200">
        <div className="flex gap-2">
          <Button onClick={runSweep} disabled={loading}>
            {loading ? 'Running…' : 'Run Now'}
          </Button>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {result && (
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">Checked {result.checked}</Badge>
              <Badge variant="outline">Reordered {result.reordered}</Badge>
              <Badge variant="outline">Failed {result.failed}</Badge>
            </div>
            <div className="text-slate-400">Last run {new Date(result.runAt).toLocaleString()}</div>
          </div>
        )}
        <div className="text-xs text-slate-500 border-t border-slate-800 pt-2">
          Cron hint: POST /api/admin/inventory/automation/trigger with an admin session or cron token.
        </div>
      </CardContent>
    </Card>
  )
}
