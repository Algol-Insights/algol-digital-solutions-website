import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminAnalyticsDashboard from '@/app/admin/analytics/page'

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

jest.mock('@/lib/api', () => ({
  getSalesAnalytics: jest.fn(() =>
    Promise.resolve({
      gmv: { total: 50000, change: 15, trend: 'up' },
      revenue: { total: 50000, change: 15, trend: 'up' },
      orders: { total: 500, change: 10, trend: 'up' },
      customers: { total: 250, change: 12, trend: 'up' },
      topProducts: [],
      recentOrders: [],
      salesByDay: [],
      salesByCategory: [],
    }),
  ),
}))

global.fetch = jest.fn()

describe('Analytics Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          timeSeries: [{ date: '2024-01-01', revenue: 1000, orderCount: 5, averageOrderValue: 200 }],
          bySegment: [{ segment: 'VIP', revenue: 5000, orderCount: 10, customerCount: 5, averageOrderValue: 500 }],
          top: [{ productId: 'prod1', productName: 'Product 1', revenue: 5000, unitsSold: 100, averagePrice: 50 }],
          cohorts: [{ cohort: '2024-01', period0: 100, retention: [100, 80, 60, 40] }],
          metrics: [{ period: '2024-01', newCustomers: 50, returningCustomers: 30, retentionRate: 60 }],
        }),
    })
  })

  it('renders dashboard title', async () => {
    render(<AdminAnalyticsDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/Analytics Dashboard/i)).toBeInTheDocument()
    })
  })

  it('displays all tabs', async () => {
    render(<AdminAnalyticsDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument()
      expect(screen.getByText('Revenue')).toBeInTheDocument()
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText('Cohorts')).toBeInTheDocument()
    })
  })

  it('switches between tabs', async () => {
    render(<AdminAnalyticsDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument()
    })

    const revenueTab = screen.getByText('Revenue')
    fireEvent.click(revenueTab)

    await waitFor(() => {
      expect(screen.getByText('Revenue Trend')).toBeInTheDocument()
    })
  })

  it('has refresh button', async () => {
    render(<AdminAnalyticsDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument()
    })
  })
})
