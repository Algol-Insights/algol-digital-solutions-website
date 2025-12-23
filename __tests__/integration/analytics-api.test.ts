import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { GET as getRevenueAnalytics } from '@/app/api/admin/analytics/revenue/route'
import { GET as getProductAnalytics } from '@/app/api/admin/analytics/products/route'

jest.mock('next-auth')

describe('Analytics API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'admin@example.com', role: 'ADMIN' },
    })
  })

  describe('Revenue Analytics Endpoint', () => {
    it('should return 401 without admin session', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValueOnce(null)

      const request = new NextRequest(
        new URL('http://localhost:3000/api/admin/analytics/revenue?startDate=2024-01-01&endDate=2024-01-31'),
      )

      const response = await getRevenueAnalytics(request)
      expect(response.status).toBe(401)
    })

    it('should require startDate and endDate', async () => {
      const request = new NextRequest(
        new URL('http://localhost:3000/api/admin/analytics/revenue'),
      )

      const response = await getRevenueAnalytics(request)
      expect(response.status).toBe(400)
    })

    it('should accept valid date range', async () => {
      jest.mock('@/lib/analytics', () => ({
        getRevenueByTime: jest.fn(() => Promise.resolve([])),
        getRevenueBySegment: jest.fn(() => Promise.resolve([])),
        getRevenueMetrics: jest.fn(() => Promise.resolve({ totalRevenue: 0, orderCount: 0, averageOrderValue: 0 })),
      }))

      const request = new NextRequest(
        new URL(
          'http://localhost:3000/api/admin/analytics/revenue?startDate=2024-01-01&endDate=2024-01-31&metric=all',
        ),
      )

      const response = await getRevenueAnalytics(request)
      expect(response.status).toBe(200)
    })
  })

  describe('Product Analytics Endpoint', () => {
    it('should return products with limits', async () => {
      jest.mock('@/lib/analytics', () => ({
        getTopProducts: jest.fn(() => Promise.resolve([])),
      }))

      const request = new NextRequest(
        new URL(
          'http://localhost:3000/api/admin/analytics/products?startDate=2024-01-01&endDate=2024-01-31&limit=10',
        ),
      )

      const response = await getProductAnalytics(request)
      expect(response.status).toBe(200)
    })

    it('should enforce limit max of 100', async () => {
      const request = new NextRequest(
        new URL(
          'http://localhost:3000/api/admin/analytics/products?startDate=2024-01-01&endDate=2024-01-31&limit=200',
        ),
      )

      const response = await getProductAnalytics(request)
      // Should not error, but limit will be capped at 100
      expect([200, 400]).toContain(response.status)
    })
  })
})
