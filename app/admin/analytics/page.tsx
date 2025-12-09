'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  getDashboardAnalytics,
  getConversionFunnel,
  getCustomerLifetimeValue,
  getProductInsights,
} from '@/lib/analytics'

export default function AdminAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  const [conversionFunnel, setConversionFunnel] = useState<any>(null)
  const [clv, setClv] = useState<any>(null)
  const [productInsights, setProductInsights] = useState<any>(null)
  const [dateRange, setDateRange] = useState('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [analyticsData, funnelData, clvData, insightsData] = await Promise.all([
          getDashboardAnalytics(),
          getConversionFunnel(),
          getCustomerLifetimeValue(),
          getProductInsights(),
        ])

        setMetrics(analyticsData)
        setConversionFunnel(funnelData)
        setClv(clvData)
        setProductInsights(insightsData)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [dateRange])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-40 bg-background">
        <div className="container mx-auto px-4 py-6">
          <Link href="/digital-solutions/admin" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Admin
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              Analytics Dashboard
            </h1>
            <div className="flex gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-card border border-border rounded-lg text-sm"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-3xl font-bold">${(metrics?.salesMetrics?.totalRevenue / 1000).toFixed(1)}k</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              12.5% from last period
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-3xl font-bold">{metrics?.salesMetrics?.totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
              <ArrowUpRight className="w-4 h-4" />
              8.3% from last period
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Order Value</p>
                <p className="text-3xl font-bold">${metrics?.salesMetrics?.averageOrderValue?.toFixed(0)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-red-600">
              <ArrowDownRight className="w-4 h-4" />
              1.2% from last period
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
                <p className="text-3xl font-bold">{metrics?.salesMetrics?.conversionRate}%</p>
              </div>
              <Eye className="w-8 h-8 text-violet-600" />
            </div>
            <div className="text-sm text-muted-foreground">
              {(conversionFunnel?.purchased || 0).toLocaleString()} purchases
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        {conversionFunnel && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6">Conversion Funnel</h2>
            <div className="space-y-4">
              {[
                { label: 'Visitors', value: conversionFunnel.visitors, color: 'bg-blue-500' },
                { label: 'Added to Cart', value: conversionFunnel.addedToCart, color: 'bg-orange-500' },
                { label: 'Checked Out', value: conversionFunnel.checkedOut, color: 'bg-yellow-500' },
                { label: 'Purchased', value: conversionFunnel.purchased, color: 'bg-green-500' },
              ].map((stage, index) => {
                const percentage = (stage.value / conversionFunnel.visitors) * 100
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{stage.label}</span>
                      <span className="text-muted-foreground">
                        {stage.value.toLocaleString()} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className={`${stage.color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Top Products</h2>
            <div className="space-y-4">
              {metrics?.topProducts?.map((product: any) => (
                <div key={product.productId} className="border-b border-border pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{product.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.unitsSold} units · ${product.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{product.rating}★</p>
                      <p className="text-xs text-muted-foreground">{product.reviews} reviews</p>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(product.unitsSold / 62) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Top Customers</h2>
            <div className="space-y-4">
              {metrics?.topCustomers?.map((customer: any) => (
                <div key={customer.customerId} className="border-b border-border pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{customer.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.orderCount} orders · {customer.lifetime}
                      </p>
                    </div>
                    <p className="font-semibold text-violet-600">${customer.totalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${(customer.totalSpent / 5234) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Insights */}
        {clv && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Average CLV</p>
              <p className="text-2xl font-bold">${clv.average?.toFixed(0)}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Median CLV</p>
              <p className="text-2xl font-bold">${clv.median?.toFixed(0)}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Max CLV</p>
              <p className="text-2xl font-bold">${clv.max?.toFixed(0)}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Total CLV</p>
              <p className="text-2xl font-bold">${(clv.total / 1000)?.toFixed(1)}k</p>
            </div>
          </div>
        )}

        {/* Product Insights */}
        {productInsights && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Best Performers */}
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-4">Best Performers</h3>
              <div className="space-y-3">
                {productInsights.bestPerformers.map((product: any) => (
                  <div key={product.productId}>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">{product.productName}</p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      ${product.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Attention */}
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-4">Needs Attention</h3>
              <div className="space-y-3">
                {productInsights.needsAttention.map((product: any) => (
                  <div key={product.productId}>
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">{product.productName}</p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Only {product.unitsSold} units sold
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* High Return Rate */}
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-4">High Return Rate</h3>
              <div className="space-y-3">
                {productInsights.highReturn.map((product: any) => (
                  <div key={product.productId}>
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">{product.productName}</p>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      {product.returnRate}% return rate
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
