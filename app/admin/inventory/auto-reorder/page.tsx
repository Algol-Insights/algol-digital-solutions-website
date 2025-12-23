'use client'

import AutoReorderTrigger from '@/components/auto-reorder-trigger'
import ReorderTaskList from '@/components/reorder-task-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-lib/card'
import AutoReorderScheduler from '@/components/auto-reorder-scheduler'

export default function AutoReorderPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Auto-Reorder</h1>
          <p className="text-slate-400 text-sm">Monitor and trigger automated reorders.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <ReorderTaskList />
          </div>
          <div className="lg:col-span-1 space-y-4">
            <AutoReorderTrigger />
            <AutoReorderScheduler />
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">How it works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 space-y-2">
                <p>Reorders are created when stock falls below the reorder point.</p>
                <p>Pending/ordered tasks are excluded from duplicate triggers.</p>
                <p>Use the manual trigger for urgent buys or overrides.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
