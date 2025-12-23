import { render, screen, waitFor } from '@testing-library/react'
import { SalesAnalyticsResponse } from '@/lib/api'

// Mock analytics data factory
export const createMockAnalyticsData = (overrides?: Partial<SalesAnalyticsResponse>): SalesAnalyticsResponse => ({
  revenue: { total: 5000, change: 12, trend: 'up' },
  gmv: { total: 5500, change: 10, trend: 'up' },
  orders: { total: 120, change: 8, trend: 'up' },
  units: { total: 280, change: 15, trend: 'up' },
  customers: { total: 85, change: 5, trend: 'up' },
  avgOrderValue: { total: 41.67, change: 3, trend: 'up' },
  topProducts: [
    { id: 'p1', name: 'Product 1', sales: 45, revenue: 2250, image: '/img1.jpg' },
    { id: 'p2', name: 'Product 2', sales: 30, revenue: 1500, image: '/img2.jpg' },
  ],
  recentOrders: [
    {
      id: 'o1',
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      total: 150,
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
  ],
  salesByDay: [
    { date: '2025-01-01', revenue: 800, orders: 16 },
    { date: '2025-01-02', revenue: 750, orders: 15 },
  ],
  salesByCategory: [
    { category: 'Electronics', revenue: 3000, percentage: 60 },
    { category: 'Accessories', revenue: 2000, percentage: 40 },
  ],
  ...overrides,
})

describe('analytics data fixtures', () => {
  it('creates valid analytics response', () => {
    const analytics = createMockAnalyticsData()
    expect(analytics.revenue.total).toBe(5000)
    expect(analytics.orders.total).toBe(120)
    expect(analytics.topProducts).toHaveLength(2)
  })

  it('supports overrides for testing edge cases', () => {
    const analytics = createMockAnalyticsData({
      revenue: { total: 0, change: -100, trend: 'down' },
      orders: { total: 0, change: -100, trend: 'down' },
    })
    expect(analytics.revenue.total).toBe(0)
    expect(analytics.orders.total).toBe(0)
    expect(analytics.revenue.trend).toBe('down')
  })

  it('preserves original metrics when overriding specific fields', () => {
    const analytics = createMockAnalyticsData({ orders: { total: 200, change: 50, trend: 'up' } })
    expect(analytics.orders.total).toBe(200)
    expect(analytics.revenue.total).toBe(5000) // unchanged
    expect(analytics.customers.total).toBe(85) // unchanged
  })
})
