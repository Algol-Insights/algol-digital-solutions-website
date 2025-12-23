'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, BarChart3, Download, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSalesAnalytics } from '@/lib/api'

export default function AdminAnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'products' | 'cohorts'>('overview')
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0])
  const [range, setRange] = useState('30d')

  const [overviewData, setOverviewData] = useState<any>(null)
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [cohortData, setCohortData] = useState<any[]>([])

  const formatCurrency = (val: number) => `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

  useEffect(() => {
    if (activeTab === 'overview') {
      setLoading(true)
      getSalesAnalytics(range)
        .then(setOverviewData)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [activeTab, range])

  useEffect(() => {
    if (activeTab !== 'overview') {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({ startDate, endDate })
      
      Promise.all([
        activeTab === 'revenue' ? fetch(`/api/admin/analytics/revenue?${params}&interval=day`).then(r => r.json()).then(d => setRevenueData(d.timeSeries || [])) : Promise.resolve(),
        activeTab === 'products' ? fetch(`/api/admin/analytics/products?${params}&limit=10&metric=revenue`).then(r => r.json()).then(d => setTopProducts(d.top || [])) : Promise.resolve(),
        activeTab === 'cohorts' ? fetch(`/api/admin/analytics/cohorts?${params}&interval=month`).then(r => r.json()).then(d => setCohortData(d.cohorts || [])) : Promise.resolve(),
      ])
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [activeTab, startDate, endDate])

  const handleExportCSV = () => {
    const headers = ['Date', 'Revenue', 'Orders', 'AOV']
    const rows = revenueData.map((d) => [d.date, d.revenue.toFixed(2), d.orderCount, d.averageOrderValue.toFixed(2)])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `revenue-${startDate}-${endDate}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link href="/admin" className="text-slate-400 hover:text-white text-sm">← Back</Link>
              <h1 className="text-2xl font-bold text-white mt-2 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" /> Analytics
              </h1>
            </div>
            <div className="flex gap-2">
              {activeTab === 'overview' && (
                <select value={range} onChange={(e) => setRange(e.target.value)} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100 text-sm">
                  <option value="7d">7 days</option>
                  <option value="30d">30 days</option>
                  <option value="90d">90 days</option>
                </select>
              )}
              {activeTab !== 'overview' && (
                <>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100 text-sm" />
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100 text-sm" />
                  {activeTab === 'revenue' && (
                    <Button size="sm" onClick={handleExportCSV} className="bg-blue-600 hover:bg-blue-700">
                      <Download className="w-4 h-4 mr-1" /> Export
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'revenue', label: 'Revenue' },
              { id: 'products', label: 'Products' },
              { id: 'cohorts', label: 'Cohorts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === tab.id ? 'border-blue-500 text-white' : 'border-transparent text-slate-400'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && <div className="p-4 bg-red-500/20 border border-red-500 rounded mb-6 text-red-200">{error}</div>}
        {loading && <div className="text-slate-300 text-center py-12">Loading...</div>}

        {!loading && activeTab === 'overview' && overviewData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'GMV', value: overviewData.gmv?.total, icon: ShoppingCart, change: overviewData.gmv?.change },
                { label: 'Orders', value: overviewData.orders?.total, icon: ShoppingCart, change: overviewData.orders?.change },
                { label: 'AOV', value: overviewData.avgOrderValue?.total, icon: TrendingUp, change: overviewData.avgOrderValue?.change, prefix: '$' },
                { label: 'Customers', value: overviewData.customers?.total, icon: Users, change: overviewData.customers?.change },
              ].map((card) => {
                const Icon = card.icon
                return (
                  <div key={card.label} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">{card.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{card.prefix}{card.value?.toLocaleString()}</p>
                    {card.change !== undefined && (
                      <p className={`text-xs mt-2 ${card.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {card.change >= 0 ? '↑' : '↓'} {Math.abs(card.change).toFixed(1)}%
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                <h2 className="text-white font-semibold mb-4">Top Products</h2>
                {overviewData.topProducts?.length ? (
                  <div className="space-y-2">
                    {overviewData.topProducts.map((p: any) => (
                      <div key={p.id} className="flex justify-between items-center p-2 bg-slate-800 rounded">
                        <span className="text-slate-300 text-sm">{p.name}</span>
                        <span className="text-white text-sm font-semibold">{formatCurrency(p.revenue)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No data</p>
                )}
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                <h2 className="text-white font-semibold mb-4">Recent Orders</h2>
                {overviewData.recentOrders?.length ? (
                  <div className="space-y-2">
                    {overviewData.recentOrders.slice(0, 5).map((o: any) => (
                      <div key={o.id} className="flex justify-between items-center p-2 bg-slate-800 rounded">
                        <div>
                          <p className="text-slate-300 text-sm">{o.orderNumber}</p>
                          <p className="text-slate-500 text-xs">{o.customerName}</p>
                        </div>
                        <span className="text-white font-semibold">{formatCurrency(o.total)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No data</p>
                )}
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'revenue' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h2 className="text-white font-semibold mb-4">Revenue Trend</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700">
                  <tr className="text-slate-400">
                    <th className="text-left py-2">Date</th>
                    <th className="text-right py-2">Revenue</th>
                    <th className="text-right py-2">Orders</th>
                    <th className="text-right py-2">AOV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {revenueData.map((d) => (
                    <tr key={d.date} className="hover:bg-slate-800/50">
                      <td className="text-slate-300 py-2">{d.date}</td>
                      <td className="text-right text-white font-semibold">{formatCurrency(d.revenue)}</td>
                      <td className="text-right text-slate-300">{d.orderCount}</td>
                      <td className="text-right text-slate-300">{formatCurrency(d.averageOrderValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && activeTab === 'products' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h2 className="text-white font-semibold mb-4">Top Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700">
                  <tr className="text-slate-400">
                    <th className="text-left py-2">Product</th>
                    <th className="text-right py-2">Revenue</th>
                    <th className="text-right py-2">Units</th>
                    <th className="text-right py-2">Avg Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {topProducts.map((p) => (
                    <tr key={p.productId} className="hover:bg-slate-800/50">
                      <td className="text-slate-300 py-2">{p.productName}</td>
                      <td className="text-right text-white font-semibold">{formatCurrency(p.revenue)}</td>
                      <td className="text-right text-slate-300">{p.unitsSold}</td>
                      <td className="text-right text-slate-300">{formatCurrency(p.averagePrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && activeTab === 'cohorts' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h2 className="text-white font-semibold mb-4">Cohort Retention</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700">
                  <tr className="text-slate-400">
                    <th className="text-left py-2">Cohort</th>
                    <th className="text-center py-2">P0</th>
                    <th className="text-center py-2">P1</th>
                    <th className="text-center py-2">P2</th>
                    <th className="text-center py-2">P3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {cohortData.map((c) => (
                    <tr key={c.cohort} className="hover:bg-slate-800/50">
                      <td className="text-slate-300 py-2">{c.cohort}</td>
                      <td className="text-center text-white">{c.period0}</td>
                      <td className="text-center text-slate-300">{c.period1} ({c.retention[1]}%)</td>
                      <td className="text-center text-slate-300">{c.period2} ({c.retention[2]}%)</td>
                      <td className="text-center text-slate-300">{c.period3} ({c.retention[3]}%)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
