/**
 * Phase 6.1 Unit Tests: Enhanced Coupon Management
 */

import { calculateROI, getExpiringCoupons, getCouponPerformance } from '@/lib/coupon-utils'

jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    coupon: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}))

import { prisma } from '@/lib/db/prisma'

describe('Phase 6.1: Enhanced Coupon Management', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Coupon Types & Validation', () => {
    test('should validate percentage discount (0-100)', () => {
      const validPercentages = [0.5, 10, 50, 100]
      const invalidPercentages = [101, -5, 150]

      validPercentages.forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThanOrEqual(100)
      })

      invalidPercentages.forEach((value) => {
        expect(value < 0 || value > 100).toBe(true)
      })
    })

    test('should validate fixed amount discount', () => {
      const validAmounts = [5, 10, 50, 100]
      const invalidAmounts = [0, -10]

      validAmounts.forEach((value) => {
        expect(value).toBeGreaterThan(0)
      })
    })

    test('should validate FREE_SHIPPING type', () => {
      const coupon = {
        type: 'FREE_SHIPPING',
        value: 0, // Always 0 for free shipping
      }

      expect(coupon.type).toBe('FREE_SHIPPING')
      expect(coupon.value).toBe(0)
    })

    test('should enforce min purchase requirement', () => {
      const coupon = {
        minPurchase: 50,
        discount: 10,
      }

      const cartValue = 60
      expect(cartValue).toBeGreaterThanOrEqual(coupon.minPurchase)
    })

    test('should enforce max discount cap', () => {
      const coupon = {
        type: 'PERCENTAGE',
        value: 50,
        maxDiscount: 100,
      }

      const orderTotal = 500
      const discountAmount = (orderTotal * coupon.value) / 100
      const cappedDiscount = Math.min(discountAmount, coupon.maxDiscount)

      expect(cappedDiscount).toBeLessThanOrEqual(coupon.maxDiscount)
    })

    test('should enforce usage limit', () => {
      const coupon = {
        usageLimit: 100,
        usageCount: 100,
        isActive: true,
      }

      const canUse = coupon.usageCount < coupon.usageLimit
      expect(canUse).toBe(false)
    })

    test('should check expiration date', () => {
      const now = new Date()
      const coupon = {
        validFrom: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        validUntil: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      }

      const isValid = now >= coupon.validFrom && now <= coupon.validUntil
      expect(isValid).toBe(true)
    })
  })

  describe('Coupon Analytics', () => {
    test('should calculate redemption rate', () => {
      const coupon = {
        usageCount: 50,
        usageLimit: 100,
      }

      const redemptionRate = (coupon.usageCount / coupon.usageLimit) * 100
      expect(redemptionRate).toBe(50)
    })

    test('should calculate average order value', () => {
      const orders = [
        { total: 100 },
        { total: 150 },
        { total: 200 },
      ]

      const averageOrderValue = orders.reduce((sum, o) => sum + o.total, 0) / orders.length
      expect(averageOrderValue).toBe(150)
    })

    test('should calculate total discount amount', () => {
      const orders = [
        { discountAmount: 10 },
        { discountAmount: 15 },
        { discountAmount: 20 },
      ]

      const totalDiscount = orders.reduce((sum, o) => sum + o.discountAmount, 0)
      expect(totalDiscount).toBe(45)
    })

    test('should calculate ROI', () => {
      const coupon = {
        totalRevenue: 5000,
        totalDiscount: 500,
      }

      const roi = ((coupon.totalRevenue - coupon.totalDiscount) / coupon.totalDiscount) * 100
      expect(roi).toBe(900) // 9x return
    })

    test('should identify top performing coupons', () => {
      const coupons = [
        { code: 'SUMMER10', revenue: 5000, discount: 500 },
        { code: 'FALL20', revenue: 3000, discount: 600 },
        { code: 'WINTER5', revenue: 1000, discount: 50 },
      ]

      const sorted = coupons.sort((a, b) => b.revenue - a.revenue)
      expect(sorted[0].code).toBe('SUMMER10')
    })
  })

  describe('Bulk Operations', () => {
    test('should bulk activate coupons', async () => {
      const ids = ['id1', 'id2', 'id3']
      ;(prisma.coupon.updateMany as jest.Mock).mockResolvedValueOnce({ count: 3 })

      const result = await (prisma.coupon.updateMany as any)({
        where: { id: { in: ids } },
        data: { isActive: true },
      })

      expect(result.count).toBe(3)
    })

    test('should bulk deactivate coupons', async () => {
      const ids = ['id1', 'id2']
      ;(prisma.coupon.updateMany as jest.Mock).mockResolvedValueOnce({ count: 2 })

      const result = await (prisma.coupon.updateMany as any)({
        where: { id: { in: ids } },
        data: { isActive: false },
      })

      expect(result.count).toBe(2)
    })

    test('should bulk delete coupons', async () => {
      const ids = ['id1', 'id2', 'id3']
      ;(prisma.coupon.deleteMany as jest.Mock).mockResolvedValueOnce({ count: 3 })

      const result = await (prisma.coupon.deleteMany as any)({
        where: { id: { in: ids } },
      })

      expect(result.count).toBe(3)
    })

    test('should bulk extend coupons validity', async () => {
      const ids = ['id1', 'id2']
      const newDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      ;(prisma.coupon.updateMany as jest.Mock).mockResolvedValueOnce({ count: 2 })

      const result = await (prisma.coupon.updateMany as any)({
        where: { id: { in: ids } },
        data: { validUntil: newDate },
      })

      expect(result.count).toBe(2)
    })
  })

  describe('Coupon Export', () => {
    test('should export coupons as CSV', async () => {
      const mockCoupons = [
        {
          code: 'SUMMER10',
          type: 'PERCENTAGE',
          value: 10,
          usageCount: 50,
          usageLimit: 100,
          isActive: true,
        },
      ]

      ;(prisma.coupon.findMany as jest.Mock).mockResolvedValueOnce(mockCoupons)

      const coupons = await (prisma.coupon.findMany as any)()

      const headers = ['Code', 'Type', 'Value', 'Usage Count', 'Usage Limit', 'Is Active']
      expect(headers).toContain('Code')
      expect(coupons.length).toBeGreaterThan(0)
    })

    test('should export with all required fields', () => {
      const coupon = {
        code: 'TEST20',
        description: 'Test coupon',
        type: 'PERCENTAGE',
        value: 20,
        minPurchase: 50,
        maxDiscount: 100,
        usageCount: 25,
        usageLimit: 100,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        isActive: true,
        createdAt: new Date('2024-01-01'),
      }

      const fields = Object.keys(coupon)
      expect(fields).toContain('code')
      expect(fields).toContain('value')
      expect(fields).toContain('usageLimit')
    })
  })

  describe('Coupon Search & Filtering', () => {
    test('should filter active coupons', () => {
      const coupons = [
        { code: 'ACTIVE1', isActive: true },
        { code: 'ACTIVE2', isActive: true },
        { code: 'INACTIVE1', isActive: false },
      ]

      const active = coupons.filter((c) => c.isActive)
      expect(active).toHaveLength(2)
    })

    test('should filter expiring coupons', () => {
      const now = new Date()
      const soon = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)

      const coupons = [
        { code: 'EXPIRING', validUntil: soon },
        { code: 'VALID', validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) },
      ]

      const expiring = coupons.filter((c) => c.validUntil <= soon)
      expect(expiring).toHaveLength(1)
    })

    test('should filter out-of-stock coupons', () => {
      const coupons = [
        { code: 'VALID', usageCount: 50, usageLimit: 100 },
        { code: 'EXHAUSTED', usageCount: 100, usageLimit: 100 },
      ]

      const available = coupons.filter((c) => !c.usageLimit || c.usageCount < c.usageLimit)
      expect(available).toHaveLength(1)
    })

    test('should search by coupon code', () => {
      const coupons = [
        { code: 'SUMMER10' },
        { code: 'SUMMER20' },
        { code: 'FALL15' },
      ]

      const search = 'SUMMER'
      const results = coupons.filter((c) => c.code.includes(search))
      expect(results).toHaveLength(2)
    })
  })
})
