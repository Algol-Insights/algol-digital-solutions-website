import { prisma } from '@/lib/db/prisma'
import { getRevenueByTime, getRevenueBySegment, getRevenueMetrics, getTopProducts, generateCohorts, getRetentionMetrics } from '@/lib/analytics'

jest.mock('@/lib/db/prisma')

describe('Analytics Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Revenue by Time', () => {
    it('should calculate revenue by day', async () => {
      const mockOrders = [
        { createdAt: new Date('2024-01-01'), total: 100, status: 'COMPLETED' },
        { createdAt: new Date('2024-01-01'), total: 200, status: 'COMPLETED' },
        { createdAt: new Date('2024-01-02'), total: 150, status: 'COMPLETED' },
      ]
      ;(prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders)

      const result = await getRevenueByTime(new Date('2024-01-01'), new Date('2024-01-02'), 'day')
      expect(result).toHaveLength(2)
      expect(result[0].revenue).toBe(300)
    })

    it('should calculate AOV correctly', async () => {
      const mockOrders = [
        { createdAt: new Date('2024-01-01'), total: 100, status: 'COMPLETED' },
        { createdAt: new Date('2024-01-01'), total: 200, status: 'COMPLETED' },
      ]
      ;(prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders)

      const result = await getRevenueByTime(new Date('2024-01-01'), new Date('2024-01-02'), 'day')
      expect(result[0].averageOrderValue).toBe(150)
    })
  })

  describe('Revenue Metrics', () => {
    it('should aggregate revenue data', async () => {
      const mockOrders = [
        { total: 100 },
        { total: 200 },
        { total: 300 },
      ]
      ;(prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders)

      const result = await getRevenueMetrics(new Date('2024-01-01'), new Date('2024-01-31'))
      expect(result.totalRevenue).toBe(600)
      expect(result.orderCount).toBe(3)
      expect(result.averageOrderValue).toBe(200)
    })

    it('should handle empty orders', async () => {
      ;(prisma.order.findMany as jest.Mock).mockResolvedValue([])

      const result = await getRevenueMetrics(new Date('2024-01-01'), new Date('2024-01-31'))
      expect(result.totalRevenue).toBe(0)
      expect(result.orderCount).toBe(0)
      expect(result.averageOrderValue).toBe(0)
    })
  })

  describe('Top Products', () => {
    it('should rank products by revenue', async () => {
      const mockItems = [
        { productId: 'prod1', price: 100, quantity: 5, product: { id: 'prod1', name: 'Product 1', categoryId: 'cat1', category: { name: 'Category A' } } },
        { productId: 'prod2', price: 50, quantity: 10, product: { id: 'prod2', name: 'Product 2', categoryId: 'cat1', category: { name: 'Category A' } } },
      ]
      ;(prisma.orderItem.findMany as jest.Mock).mockResolvedValue(mockItems)

      const result = await getTopProducts(new Date('2024-01-01'), new Date('2024-01-31'), 10, 'revenue')
      expect(result).toHaveLength(2)
      expect(result[0].productName).toBe('Product 1')
      expect(result[0].revenue).toBe(500)
    })

    it('should respect limit parameter', async () => {
      const mockItems = Array.from({ length: 20 }, (_, i) => ({
        productId: `prod${i}`,
        price: 100,
        quantity: 1,
        product: { id: `prod${i}`, name: `Product ${i}`, categoryId: 'cat1', category: { name: 'Cat' } },
      }))
      ;(prisma.orderItem.findMany as jest.Mock).mockResolvedValue(mockItems)

      const result = await getTopProducts(new Date('2024-01-01'), new Date('2024-01-31'), 5, 'revenue')
      expect(result.length).toBeLessThanOrEqual(5)
    })
  })

  describe('Cohorts', () => {
    it('should generate cohort data', async () => {
      const mockCustomers = [
        {
          id: 'cust1',
          createdAt: new Date('2024-01-01'),
          orders: [
            { createdAt: new Date('2024-01-01'), total: 100 },
            { createdAt: new Date('2024-02-01'), total: 100 },
          ],
        },
        {
          id: 'cust2',
          createdAt: new Date('2024-02-01'),
          orders: [{ createdAt: new Date('2024-02-01'), total: 100 }],
        },
      ]
      ;(prisma.customer.findMany as jest.Mock).mockResolvedValue(mockCustomers)

      const result = await generateCohorts(new Date('2024-01-01'), new Date('2024-02-28'), 'month')
      expect(result.length).toBeGreaterThanOrEqual(1)
      expect(result[0]).toHaveProperty('period0')
      expect(result[0]).toHaveProperty('retention')
    })
  })

  describe('Retention Metrics', () => {
    it('should track new vs returning customers', async () => {
      const mockOrders = [
        { customerId: 'cust1', createdAt: new Date('2024-01-15'), customer: { id: 'cust1', createdAt: new Date('2024-01-15') } },
        { customerId: 'cust2', createdAt: new Date('2024-01-20'), customer: { id: 'cust2', createdAt: new Date('2024-01-01') } },
      ]
      ;(prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders)

      const result = await getRetentionMetrics(new Date('2024-01-01'), new Date('2024-01-31'), 'month')
      expect(result).toHaveLength(1)
      expect(result[0].newCustomers).toBe(1)
      expect(result[0].returningCustomers).toBe(1)
    })

    it('should calculate retention rate', async () => {
      const mockOrders = [
        { customerId: 'cust1', createdAt: new Date('2024-01-15'), customer: { id: 'cust1', createdAt: new Date('2024-01-15') } },
        { customerId: 'cust2', createdAt: new Date('2024-01-20'), customer: { id: 'cust2', createdAt: new Date('2024-01-01') } },
        { customerId: 'cust3', createdAt: new Date('2024-01-25'), customer: { id: 'cust3', createdAt: new Date('2024-01-01') } },
      ]
      ;(prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders)

      const result = await getRetentionMetrics(new Date('2024-01-01'), new Date('2024-01-31'), 'month')
      expect(result[0].retentionRate).toBeLessThanOrEqual(100)
      expect(result[0].retentionRate).toBeGreaterThanOrEqual(0)
    })
  })
})
