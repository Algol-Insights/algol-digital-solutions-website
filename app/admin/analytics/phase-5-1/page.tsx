'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RFMSegment {
  segment: string
  count: number
  avgRecency: number
  avgFrequency: number
  avgMonetary: number
  revenue: number
}

interface CLVSummary {
  totalCustomers: number
  highValue: number
  mediumValue: number
  lowValue: number
  totalLTV: number
  averageLTV: number
  totalCurrentValue: number
}

interface CLVData {
  customerId: string
  customerName: string
  currentValue: number
  predictedValue: number
  churnRisk: number
  ltv: number
  valueSegment: string
}

interface ChurnPrediction {
  customerId: string
  customerName: string
  customerEmail: string
  churnProbability: number
  churnRisk: 'low' | 'medium' | 'high'
  riskFactors: string[]
  lastOrderDate: Date
  daysSinceLastOrder: number
  predictedChurnDate: Date | null
}

interface ChurnSummary {
  totalAtRisk: number
  highRisk: number
  mediumRisk: number
  lowRisk: number
  averageChurnProbability: number
}

export default function Phase51Dashboard() {
  const [activeTab, setActiveTab] = useState<'rfm' | 'clv' | 'churn'>('rfm')
  const [rfmSegments, setRfmSegments] = useState<RFMSegment[]>([])
  const [clvData, setClvData] = useState<CLVData[]>([])
  const [clvSummary, setClvSummary] = useState<CLVSummary | null>(null)
  const [churnData, setChurnData] = useState<ChurnPrediction[]>([])
  const [churnSummary, setChurnSummary] = useState<ChurnSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clvSegmentFilter, setClvSegmentFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [churnRiskFilter, setChurnRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  // Fetch RFM data
  useEffect(() => {
    const fetchRFM = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/admin/analytics/rfm?view=summary')
        if (!res.ok) throw new Error('Failed to fetch RFM data')
        const data = await res.json()
        setRfmSegments(data.segments)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === 'rfm') {
      fetchRFM()
    }
  }, [activeTab])

  // Fetch CLV data
  useEffect(() => {
    const fetchCLV = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/admin/analytics/clv?segment=${clvSegmentFilter}`)
        if (!res.ok) throw new Error('Failed to fetch CLV data')
        const data = await res.json()
        setClvData(data.data)
        setClvSummary(data.summary)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === 'clv') {
      fetchCLV()
    }
  }, [activeTab, clvSegmentFilter])

  // Fetch Churn data
  useEffect(() => {
    const fetchChurn = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/admin/analytics/churn?riskLevel=${churnRiskFilter}`)
        if (!res.ok) throw new Error('Failed to fetch churn predictions')
        const data = await res.json()
        setChurnData(data.predictions)
        setChurnSummary(data.summary)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === 'churn') {
      fetchChurn()
    }
  }, [activeTab, churnRiskFilter])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/analytics" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
              ← Back to Analytics
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2">Phase 5.1: Advanced Customer Analytics</h1>
          <p className="text-slate-300">RFM Analysis, Customer Lifetime Value, and Churn Prediction</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          {(['rfm', 'clv', 'churn'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab === 'rfm' && 'RFM Analysis'}
              {tab === 'clv' && 'Customer Lifetime Value'}
              {tab === 'churn' && 'Churn Prediction'}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6 text-red-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="mt-4">Loading data...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* RFM Tab */}
            {activeTab === 'rfm' && (
              <div className="space-y-6">
                <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                  <h2 className="text-2xl font-bold mb-4">RFM Segmentation Analysis</h2>
                  <p className="text-slate-300 mb-6">
                    RFM (Recency, Frequency, Monetary) segments customers based on their purchase behavior. Use these segments to target marketing campaigns and retention efforts.
                  </p>

                  {rfmSegments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-700/50 border-b border-slate-600">
                          <tr>
                            <th className="px-4 py-3 text-left">Segment</th>
                            <th className="px-4 py-3 text-right">Customers</th>
                            <th className="px-4 py-3 text-right">Avg Recency (days)</th>
                            <th className="px-4 py-3 text-right">Avg Frequency</th>
                            <th className="px-4 py-3 text-right">Avg Monetary</th>
                            <th className="px-4 py-3 text-right">Total Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {rfmSegments.map((segment) => (
                            <tr key={segment.segment} className="hover:bg-slate-700/30">
                              <td className="px-4 py-3 font-semibold text-blue-300">{segment.segment}</td>
                              <td className="px-4 py-3 text-right">{segment.count}</td>
                              <td className="px-4 py-3 text-right">{segment.avgRecency}</td>
                              <td className="px-4 py-3 text-right">{segment.avgFrequency.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right">${segment.avgMonetary.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right font-semibold text-green-400">${segment.revenue.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-slate-400">No RFM data available yet</p>
                  )}
                </div>

                <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-bold mb-4">Segment Descriptions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                      <div className="font-semibold text-green-400 mb-2">Champions</div>
                      <div className="text-slate-300">Recent, frequent, high-spending customers. Your best customers.</div>
                    </div>
                    <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                      <div className="font-semibold text-blue-400 mb-2">Loyal Customers</div>
                      <div className="text-slate-300">High-spending, consistent customers with strong purchase history.</div>
                    </div>
                    <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                      <div className="font-semibold text-yellow-400 mb-2">At Risk</div>
                      <div className="text-slate-300">Former good customers who haven't purchased recently.</div>
                    </div>
                    <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                      <div className="font-semibold text-orange-400 mb-2">Lost Customers</div>
                      <div className="text-slate-300">Low engagement across all metrics. May need reactivation campaigns.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CLV Tab */}
            {activeTab === 'clv' && (
              <div className="space-y-6">
                {clvSummary && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                      <div className="text-slate-400 text-sm">High Value Customers</div>
                      <div className="text-3xl font-bold text-green-400">{clvSummary.highValue}</div>
                      <div className="text-xs text-slate-500 mt-2">LTV ≥ $10,000</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                      <div className="text-slate-400 text-sm">Medium Value</div>
                      <div className="text-3xl font-bold text-blue-400">{clvSummary.mediumValue}</div>
                      <div className="text-xs text-slate-500 mt-2">LTV $3,000 - $10,000</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                      <div className="text-slate-400 text-sm">Average LTV</div>
                      <div className="text-3xl font-bold text-purple-400">${clvSummary.averageLTV.toFixed(0)}</div>
                      <div className="text-xs text-slate-500 mt-2">All customers</div>
                    </div>
                  </div>
                )}

                <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Customer Lifetime Value</h2>
                    <select
                      value={clvSegmentFilter}
                      onChange={(e) => setClvSegmentFilter(e.target.value as any)}
                      className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm"
                    >
                      <option value="all">All Segments</option>
                      <option value="high">High Value</option>
                      <option value="medium">Medium Value</option>
                      <option value="low">Low Value</option>
                    </select>
                  </div>

                  {clvData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-700/50 border-b border-slate-600">
                          <tr>
                            <th className="px-4 py-3 text-left">Customer</th>
                            <th className="px-4 py-3 text-right">Current Value</th>
                            <th className="px-4 py-3 text-right">Predicted Value (2yr)</th>
                            <th className="px-4 py-3 text-right">Churn Risk</th>
                            <th className="px-4 py-3 text-right">Lifetime Value</th>
                            <th className="px-4 py-3 text-center">Segment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {clvData.slice(0, 20).map((customer) => (
                            <tr key={customer.customerId} className="hover:bg-slate-700/30">
                              <td className="px-4 py-3">{customer.customerName}</td>
                              <td className="px-4 py-3 text-right">${customer.currentValue.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right">${customer.predictedValue.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right">
                                <span className={customer.churnRisk > 50 ? 'text-red-400' : 'text-green-400'}>
                                  {customer.churnRisk.toFixed(0)}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-blue-300">${customer.ltv.toFixed(2)}</td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${
                                    customer.valueSegment === 'high'
                                      ? 'bg-green-900/30 text-green-400'
                                      : customer.valueSegment === 'medium'
                                        ? 'bg-blue-900/30 text-blue-400'
                                        : 'bg-slate-700/30 text-slate-300'
                                  }`}
                                >
                                  {customer.valueSegment}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-slate-400">No CLV data available yet</p>
                  )}

                  {clvData.length > 20 && (
                    <p className="text-slate-400 text-sm mt-4">Showing top 20 customers. {clvData.length} total.</p>
                  )}
                </div>
              </div>
            )}

            {/* Churn Tab */}
            {activeTab === 'churn' && (
              <div className="space-y-6">
                {churnSummary && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                      <div className="text-slate-400 text-sm">Total at Risk</div>
                      <div className="text-3xl font-bold text-orange-400">{churnSummary.totalAtRisk}</div>
                      <div className="text-xs text-slate-500 mt-2">Customers</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                      <div className="text-slate-400 text-sm">High Risk</div>
                      <div className="text-3xl font-bold text-red-400">{churnSummary.highRisk}</div>
                      <div className="text-xs text-slate-500 mt-2">60%+ probability</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                      <div className="text-slate-400 text-sm">Medium Risk</div>
                      <div className="text-3xl font-bold text-yellow-400">{churnSummary.mediumRisk}</div>
                      <div className="text-xs text-slate-500 mt-2">35-60% probability</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                      <div className="text-slate-400 text-sm">Avg Probability</div>
                      <div className="text-3xl font-bold text-purple-400">{churnSummary.averageChurnProbability.toFixed(0)}%</div>
                      <div className="text-xs text-slate-500 mt-2">All at-risk</div>
                    </div>
                  </div>
                )}

                <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Churn Predictions</h2>
                    <select
                      value={churnRiskFilter}
                      onChange={(e) => setChurnRiskFilter(e.target.value as any)}
                      className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm"
                    >
                      <option value="all">All Risk Levels</option>
                      <option value="high">High Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="low">Low Risk</option>
                    </select>
                  </div>

                  {churnData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-700/50 border-b border-slate-600">
                          <tr>
                            <th className="px-4 py-3 text-left">Customer</th>
                            <th className="px-4 py-3 text-right">Churn Probability</th>
                            <th className="px-4 py-3 text-center">Risk Level</th>
                            <th className="px-4 py-3 text-right">Days Since Order</th>
                            <th className="px-4 py-3 text-left">Risk Factors</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {churnData.slice(0, 20).map((customer) => (
                            <tr key={customer.customerId} className="hover:bg-slate-700/30">
                              <td className="px-4 py-3">
                                <div className="font-semibold">{customer.customerName}</div>
                                <div className="text-xs text-slate-400">{customer.customerEmail}</div>
                              </td>
                              <td className="px-4 py-3 text-right font-bold">
                                <span
                                  className={
                                    customer.churnProbability >= 60
                                      ? 'text-red-400'
                                      : customer.churnProbability >= 35
                                        ? 'text-yellow-400'
                                        : 'text-green-400'
                                  }
                                >
                                  {customer.churnProbability}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${
                                    customer.churnRisk === 'high'
                                      ? 'bg-red-900/30 text-red-400'
                                      : customer.churnRisk === 'medium'
                                        ? 'bg-yellow-900/30 text-yellow-400'
                                        : 'bg-green-900/30 text-green-400'
                                  }`}
                                >
                                  {customer.churnRisk}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">{customer.daysSinceLastOrder} days</td>
                              <td className="px-4 py-3">
                                <div className="text-xs space-y-1">
                                  {customer.riskFactors.length > 0 ? (
                                    customer.riskFactors.map((factor, idx) => (
                                      <div key={idx} className="text-slate-300">
                                        • {factor}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-slate-500">No specific factors</div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-slate-400">No churn predictions available yet</p>
                  )}

                  {churnData.length > 20 && (
                    <p className="text-slate-400 text-sm mt-4">Showing top 20 at-risk customers. {churnData.length} total.</p>
                  )}
                </div>

                <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-bold mb-4">Churn Risk Factors</h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                      <div className="font-semibold text-blue-300 mb-1">Days Since Last Order</div>
                      <div className="text-slate-300">The most significant churn indicator. High risk if no purchases in 90+ days.</div>
                    </div>
                    <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                      <div className="font-semibold text-blue-300 mb-1">Purchase Frequency Decline</div>
                      <div className="text-slate-300">Declining purchase patterns indicate loss of engagement.</div>
                    </div>
                    <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                      <div className="font-semibold text-blue-300 mb-1">Average Order Value Decrease</div>
                      <div className="text-slate-300">Customers reducing spend may be exploring alternatives.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
