'use client'

import SalesVelocityPanel from '@/components/sales-velocity-panel'
import StockRecommendationsPanel from '@/components/stock-recommendations-panel'
import ForecastingOverview from '@/components/forecasting-overview'

export default function ForecastingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Inventory Forecasting</h1>
          <p className="text-slate-400 text-sm">Sales velocity, demand variance, and stock recommendations.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <StockRecommendationsPanel />
            <ForecastingOverview />
          </div>
          <div className="xl:col-span-1 space-y-6">
            <SalesVelocityPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
