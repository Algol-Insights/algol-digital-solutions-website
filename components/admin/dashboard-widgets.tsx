"use client"

import { useMemo } from 'react'
import { Activity, TrendingUp, ShieldCheck } from 'lucide-react'

interface WidgetProps {
  inventorySummary: {
    lowStockCount: number
    outOfStockCount: number
  }
}

export function DashboardWidgets({ inventorySummary }: WidgetProps) {
  const cards = useMemo(
    () => [
      {
        title: 'Low Stock',
        value: inventorySummary.lowStockCount,
        subtitle: 'Requires replenishment',
        icon: Activity,
        accent: 'from-amber-500/30 to-orange-600/20 border-amber-400/50',
      },
      {
        title: 'Out of Stock',
        value: inventorySummary.outOfStockCount,
        subtitle: 'Unavailable items',
        icon: ShieldCheck,
        accent: 'from-red-500/30 to-rose-600/20 border-rose-400/50',
      },
      {
        title: 'Fulfillment Health',
        value: 'On Track',
        subtitle: 'Auto-reorder + alerts active',
        icon: TrendingUp,
        accent: 'from-emerald-500/25 to-teal-600/20 border-emerald-400/50',
      },
    ],
    [inventorySummary]
  )

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl border ${card.accent} bg-gradient-to-br p-4 text-slate-100 shadow-lg shadow-slate-900/40`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm uppercase tracking-wide text-slate-200/80">{card.title}</div>
              <div className="text-3xl font-bold text-white">{card.value}</div>
              <div className="text-sm text-slate-200/70">{card.subtitle}</div>
            </div>
            <div className="rounded-lg bg-slate-900/30 p-3">
              <card.icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
