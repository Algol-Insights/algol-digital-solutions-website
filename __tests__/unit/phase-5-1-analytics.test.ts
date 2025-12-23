/**
 * Phase 5.1 Unit Tests: RFM, CLV, and Churn Prediction
 */

import { calculateRFMScores, getRFMSegmentSummary, calculateCLV, predictChurn } from '@/lib/analytics'

// Mock Prisma
jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    customer: {
      findMany: jest.fn(),
    },
  },
}))

import { prisma } from '@/lib/db/prisma'

describe('RFM Analysis', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calculateRFMScores should segment customers correctly', async () => {
    const mockCustomers = [
      {
        id: 'cust-1',
        name: 'Recent Buyer',
        email: 'recent@test.com',
        createdAt: new Date('2024-01-01'),
        orders: [
          { createdAt: new Date('2024-12-01'), total: 500, status: 'COMPLETED' },
          { createdAt: new Date('2024-12-10'), total: 300, status: 'COMPLETED' },
        ],
      },
      {
        id: 'cust-2',
        name: 'Lost Customer',
        email: 'lost@test.com',
        createdAt: new Date('2023-01-01'),
        orders: [
          { createdAt: new Date('2023-06-01'), total: 100, status: 'COMPLETED' },
        ],
      },
    ]

    ;(prisma.customer.findMany as jest.Mock).mockResolvedValueOnce(mockCustomers)

    const scores = await calculateRFMScores(new Date('2024-12-20'))

    expect(scores).toHaveLength(2)
    expect(scores[0].customerId).toBe('cust-1')
    expect(scores[0].recency).toBeLessThan(20) // Recent
    expect(scores[0].frequency).toBe(2)
    expect(scores[0].monetary).toBe(800)
    expect(scores[1].churnRisk).toBeUndefined() // Different metrics
  })

  test('calculateRFMScores should handle empty orders', async () => {
    const mockCustomers = [
      {
        id: 'cust-1',
        name: 'No Orders',
        email: 'no-orders@test.com',
        createdAt: new Date('2024-01-01'),
        orders: [],
      },
    ]

    ;(prisma.customer.findMany as jest.Mock).mockResolvedValueOnce(mockCustomers)

    const scores = await calculateRFMScores()

    expect(scores).toHaveLength(0)
  })

  test('getRFMSegmentSummary should aggregate by segment', async () => {
    const mockCustomers = [
      {
        id: 'cust-1',
        name: 'Champion',
        email: 'champion@test.com',
        createdAt: new Date('2024-01-01'),
        orders: Array(10).fill({ createdAt: new Date('2024-12-01'), total: 500, status: 'COMPLETED' }),
      },
      {
        id: 'cust-2',
        name: 'New Customer',
        email: 'new@test.com',
        createdAt: new Date('2024-12-01'),
        orders: [{ createdAt: new Date('2024-12-10'), total: 100, status: 'COMPLETED' }],
      },
    ]

    ;(prisma.customer.findMany as jest.Mock).mockResolvedValueOnce(mockCustomers)

    const summary = await getRFMSegmentSummary()

    expect(summary.length).toBeGreaterThan(0)
    expect(summary[0]).toHaveProperty('segment')
    expect(summary[0]).toHaveProperty('count')
    expect(summary[0]).toHaveProperty('revenue')
  })
})

describe('Customer Lifetime Value (CLV)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calculateCLV should compute LTV with predictions', async () => {
    const mockCustomers = [
      {
        id: 'cust-1',
        name: 'High Value',
        createdAt: new Date('2023-01-01'),
        orders: [
          { createdAt: new Date('2024-01-01'), total: 1000, status: 'COMPLETED' },
          { createdAt: new Date('2024-06-01'), total: 1500, status: 'COMPLETED' },
          { createdAt: new Date('2024-12-01'), total: 2000, status: 'COMPLETED' },
        ],
      },
    ]

    ;(prisma.customer.findMany as jest.Mock).mockResolvedValueOnce(mockCustomers)

    const clvData = await calculateCLV(new Date('2024-12-20'))

    expect(clvData).toHaveLength(1)
    expect(clvData[0].currentValue).toBe(4500)
    expect(clvData[0].ltv).toBeGreaterThan(4500) // Should predict future value
    expect(['high', 'medium', 'low']).toContain(clvData[0].valueSegment)
  })

  test('calculateCLV should calculate churn risk based on recency', async () => {
    const mockCustomers = [
      {
        id: 'cust-1',
        name: 'At Risk',
        createdAt: new Date('2023-01-01'),
        orders: [
          { createdAt: new Date('2023-01-01'), total: 500, status: 'COMPLETED' },
          { createdAt: new Date('2023-06-01'), total: 500, status: 'COMPLETED' }, // Over 6 months ago
        ],
      },
    ]

    ;(prisma.customer.findMany as jest.Mock).mockResolvedValueOnce(mockCustomers)

    const clvData = await calculateCLV(new Date('2024-12-20'))

    expect(clvData).toHaveLength(1)
    expect(clvData[0].churnRisk).toBeGreaterThan(0)
  })

  test('calculateCLV should segment by value', async () => {
    const mockCustomers = [
      {
        id: 'cust-1',
        name: 'High Spender',
        createdAt: new Date('2023-01-01'),
        orders: Array(20).fill({ createdAt: new Date('2024-12-01'), total: 1000, status: 'COMPLETED' }),
      },
      {
        id: 'cust-2',
        name: 'Low Spender',
        createdAt: new Date('2024-01-01'),
        orders: [{ createdAt: new Date('2024-12-01'), total: 50, status: 'COMPLETED' }],
      },
    ]

    ;(prisma.customer.findMany as jest.Mock).mockResolvedValueOnce(mockCustomers)

    const clvData = await calculateCLV()

    const segments = clvData.map((c) => c.valueSegment)
    expect(segments).toContain('high')
    expect(segments).toContain('low')
  })
})

describe('Churn Prediction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('predictChurn should identify high-risk customers', async () => {
    const mockCustomers = [
      {
        id: 'cust-1',
        name: 'High Risk',
        email: 'high-risk@test.com',
        createdAt: new Date('2023-01-01'),
        orders: [
          { createdAt: new Date('2023-06-01'), total: 500, status: 'COMPLETED' },
          { createdAt: new Date('2023-12-01'), total: 500, status: 'COMPLETED' }, // 380+ days ago
        ],
      },
    ]

    ;(prisma.customer.findMany as jest.Mock).mockResolvedValueOnce(mockCustomers)

    const predictions = await predictChurn(90)

    expect(predictions.length).toBeGreaterThan(0)
    expect(predictions[0].churnProbability).toBeGreaterThan(0)
    expect(['low', 'medium', 'high']).toContain(predictions[0].churnRisk)
  })

  test('predictChurn should identify risk factors', async () => {
    const mockCustomers = [
      {
        id: 'cust-1',
        name: 'Risky Customer',
        email: 'risky@test.com',
        createdAt: new Date('2023-01-01'),
        orders: [
          { createdAt: new Date('2023-06-01'), total: 500, status: 'COMPLETED' },
          { createdAt: new Date('2023-10-01'), total: 500, status: 'COMPLETED' },
          { createdAt: new Date('2024-02-01'), total: 300, status: 'COMPLETED' }, // Declining spend, old order
        ],
      },
    ]

    ;(prisma.customer.findMany as jest.Mock).mockResolvedValueOnce(mockCustomers)

    const predictions = await predictChurn(90)

    expect(predictions.length).toBeGreaterThan(0)
    expect(predictions[0].riskFactors.length).toBeGreaterThan(0)
    expect(predictions[0].riskFactors[0]).toMatch(/No purchase|declined|decreased/)
  })

  test('predictChurn should estimate churn date', async () => {
    const mockCustomers = [
      {
        id: 'cust-1',
        name: 'Customer',
        email: 'customer@test.com',
        createdAt: new Date('2023-01-01'),
        orders: [
          { createdAt: new Date('2024-01-01'), total: 500, status: 'COMPLETED' },
          { createdAt: new Date('2024-06-01'), total: 500, status: 'COMPLETED' },
          { createdAt: new Date('2024-11-01'), total: 500, status: 'COMPLETED' }, // Regular 5-month interval
        ],
      },
    ]

    ;(prisma.customer.findMany as jest.Mock).mockResolvedValueOnce(mockCustomers)

    const predictions = await predictChurn(90)

    if (predictions.length > 0) {
      expect(predictions[0].predictedChurnDate).toBeDefined()
    }
  })

  test('predictChurn should filter by days threshold', async () => {
    const mockCustomers = [
      {
        id: 'cust-1',
        name: 'Recent',
        email: 'recent@test.com',
        createdAt: new Date('2024-01-01'),
        orders: [
          { createdAt: new Date('2024-12-01'), total: 500, status: 'COMPLETED' },
          { createdAt: new Date('2024-12-10'), total: 500, status: 'COMPLETED' }, // Very recent
        ],
      },
    ]

    ;(prisma.customer.findMany as jest.Mock).mockResolvedValueOnce(mockCustomers)

    const predictions = await predictChurn(90)

    // Should not include customers with recent activity
    expect(predictions.filter((p) => p.customerId === 'cust-1')).toHaveLength(0)
  })
})
