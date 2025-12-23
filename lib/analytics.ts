/**
 * Sales and customer analytics system
 */

import { prisma } from '@/lib/db/prisma'

export type TimeInterval = 'day' | 'week' | 'month' | 'year'
export type CohortInterval = 'month' | 'week'

export interface SalesMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  conversionRate: number
  repeatCustomers: number
}

export interface ProductAnalytics {
  productId: string
  productName: string
  unitsSold: number
  revenue: number
  rating: number
  reviews: number
  returnRate: number
}

export interface CustomerAnalytics {
  customerId: string
  customerName: string
  customerEmail: string
  totalSpent: number
  orderCount: number
  averageOrderValue: number
  lastOrderDate: string
  signupDate: string
  lifetime: string // days since signup
}

export interface DateRange {
  start: Date
  end: Date
}

export interface TimeSeriesData {
  date: string
  value: number
}

export interface DashboardMetrics {
  salesMetrics: SalesMetrics
  topProducts: ProductAnalytics[]
  topCustomers: CustomerAnalytics[]
  revenueByDay: TimeSeriesData[]
  ordersByDay: TimeSeriesData[]
  conversionFunnel: {
    visitors: number
    addedToCart: number
    checkedOut: number
    purchased: number
  }
}

// Mock analytics data
const mockAnalyticsData: DashboardMetrics = {
  salesMetrics: {
    totalRevenue: 125000,
    totalOrders: 542,
    averageOrderValue: 230.63,
    conversionRate: 3.2,
    repeatCustomers: 127,
  },
  topProducts: [
    {
      productId: 'prod-1',
      productName: 'Premium Laptop Pro',
      unitsSold: 48,
      revenue: 95999.52,
      rating: 4.8,
      reviews: 24,
      returnRate: 2.1,
    },
    {
      productId: 'prod-2',
      productName: 'Gaming Monitor',
      unitsSold: 35,
      revenue: 20999.65,
      rating: 4.5,
      reviews: 18,
      returnRate: 1.5,
    },
    {
      productId: 'prod-3',
      productName: 'Wireless Headphones',
      unitsSold: 62,
      revenue: 15499.38,
      rating: 4.6,
      reviews: 31,
      returnRate: 3.2,
    },
  ],
  topCustomers: [
    {
      customerId: 'cust-1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      totalSpent: 5234.99,
      orderCount: 8,
      averageOrderValue: 654.37,
      lastOrderDate: '2024-12-08',
      signupDate: '2024-01-15',
      lifetime: '331 days',
    },
    {
      customerId: 'cust-2',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      totalSpent: 4128.50,
      orderCount: 6,
      averageOrderValue: 688.08,
      lastOrderDate: '2024-12-07',
      signupDate: '2024-02-20',
      lifetime: '294 days',
    },
    {
      customerId: 'cust-3',
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      totalSpent: 3891.23,
      orderCount: 5,
      averageOrderValue: 778.25,
      lastOrderDate: '2024-12-05',
      signupDate: '2024-03-10',
      lifetime: '274 days',
    },
  ],
  revenueByDay: [
    { date: '2024-12-01', value: 3400 },
    { date: '2024-12-02', value: 3200 },
    { date: '2024-12-03', value: 4100 },
    { date: '2024-12-04', value: 3800 },
    { date: '2024-12-05', value: 4300 },
    { date: '2024-12-06', value: 3900 },
    { date: '2024-12-07', value: 4200 },
    { date: '2024-12-08', value: 4500 },
    { date: '2024-12-09', value: 4000 },
  ],
  ordersByDay: [
    { date: '2024-12-01', value: 15 },
    { date: '2024-12-02', value: 14 },
    { date: '2024-12-03', value: 18 },
    { date: '2024-12-04', value: 16 },
    { date: '2024-12-05', value: 19 },
    { date: '2024-12-06', value: 17 },
    { date: '2024-12-07', value: 18 },
    { date: '2024-12-08', value: 20 },
    { date: '2024-12-09', value: 17 },
  ],
  conversionFunnel: {
    visitors: 39000,
    addedToCart: 4800,
    checkedOut: 950,
    purchased: 542,
  },
}

/**
 * Get dashboard analytics
 */
export async function getDashboardAnalytics(
  dateRange?: DateRange,
): Promise<DashboardMetrics> {
  // In production, calculate from database based on dateRange
  return mockAnalyticsData
}

/**
 * Get sales metrics for time period
 */
export async function getSalesMetrics(
  dateRange: DateRange,
): Promise<SalesMetrics> {
  // In production, query database with dateRange filter
  return mockAnalyticsData.salesMetrics
}

/**
 * Get top selling products
 */
/**
 * Get top customers
 */
export async function getTopCustomers(
  limit: number = 10,
  dateRange?: DateRange,
): Promise<CustomerAnalytics[]> {
  // In production, query database
  return mockAnalyticsData.topCustomers.slice(0, limit)
}

/**
 * Get revenue trend
 */
export async function getRevenueTrend(
  dateRange: DateRange,
): Promise<TimeSeriesData[]> {
  // In production, calculate from database
  return mockAnalyticsData.revenueByDay
}

/**
 * Get orders trend
 */
export async function getOrdersTrend(
  dateRange: DateRange,
): Promise<TimeSeriesData[]> {
  // In production, calculate from database
  return mockAnalyticsData.ordersByDay
}

/**
 * Get conversion funnel metrics
 */
export async function getConversionFunnel(): Promise<{
  visitors: number
  addedToCart: number
  checkedOut: number
  purchased: number
  cartAbandonment: number
  checkoutAbandonment: number
}> {
  const funnel = mockAnalyticsData.conversionFunnel

  return {
    ...funnel,
    cartAbandonment: Math.round(((funnel.addedToCart - funnel.checkedOut) / funnel.addedToCart) * 100),
    checkoutAbandonment: Math.round(((funnel.checkedOut - funnel.purchased) / funnel.checkedOut) * 100),
  }
}

/**
 * Get customer lifetime value
 */
export async function getCustomerLifetimeValue(): Promise<{
  average: number
  median: number
  min: number
  max: number
  total: number
}> {
  const topCustomers = mockAnalyticsData.topCustomers
  const allValues = topCustomers.map((c) => c.totalSpent)

  const sorted = [...allValues].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]

  return {
    average: mockAnalyticsData.topCustomers.length > 0 ? mockAnalyticsData.salesMetrics.totalRevenue / mockAnalyticsData.topCustomers.length : 0,
    median: median || 0,
    min: allValues.length > 0 ? Math.min(...allValues) : 0,
    max: allValues.length > 0 ? Math.max(...allValues) : 0,
    total: allValues.reduce((sum, val) => sum + val, 0),
  }
}

/**
 * Get product performance insights
 */
export async function getProductInsights(): Promise<{
  bestPerformers: ProductAnalytics[]
  needsAttention: ProductAnalytics[]
  highReturn: ProductAnalytics[]
}> {
  const products = mockAnalyticsData.topProducts

  return {
    bestPerformers: products.sort((a, b) => b.revenue - a.revenue).slice(0, 3),
    needsAttention: products.sort((a, b) => a.unitsSold - b.unitsSold).slice(0, 3),
    highReturn: products.sort((a, b) => b.returnRate - a.returnRate).slice(0, 3),
  }
}

/**
 * Calculate growth metrics
 */
export async function getGrowthMetrics(
  previousPeriod: DateRange,
  currentPeriod: DateRange,
): Promise<{
  revenueGrowth: number
  orderGrowth: number
  customerGrowth: number
  aovGrowth: number
}> {
  // In production, calculate from database
  return {
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    customerGrowth: 15.2,
    aovGrowth: -1.2,
  }
}
/**
 * Time Interval Helpers
 */

function getDateBucket(date: Date, interval: TimeInterval): Date {
  const d = new Date(date)
  switch (interval) {
    case 'day':
      d.setHours(0, 0, 0, 0)
      return d
    case 'week':
      d.setDate(d.getDate() - d.getDay())
      d.setHours(0, 0, 0, 0)
      return d
    case 'month':
      d.setDate(1)
      d.setHours(0, 0, 0, 0)
      return d
    case 'year':
      d.setMonth(0, 1)
      d.setHours(0, 0, 0, 0)
      return d
  }
}

function addInterval(date: Date, interval: TimeInterval, count: number = 1): Date {
  const d = new Date(date)
  switch (interval) {
    case 'day':
      d.setDate(d.getDate() + count)
      break
    case 'week':
      d.setDate(d.getDate() + count * 7)
      break
    case 'month':
      d.setMonth(d.getMonth() + count)
      break
    case 'year':
      d.setFullYear(d.getFullYear() + count)
      break
  }
  return d
}

function formatDateLabel(date: Date, interval: TimeInterval): string {
  switch (interval) {
    case 'day':
      return date.toISOString().split('T')[0]
    case 'week':
      const weekEnd = new Date(date)
      weekEnd.setDate(weekEnd.getDate() + 6)
      return `${date.toISOString().split('T')[0]} - ${weekEnd.toISOString().split('T')[0]}`
    case 'month':
      return date.toISOString().slice(0, 7)
    case 'year':
      return date.getFullYear().toString()
  }
}

/**
 * Revenue Analytics
 */

export interface RevenueDataPoint {
  date: string
  bucket: Date
  revenue: number
  orderCount: number
  averageOrderValue: number
}

export interface RevenueBySegment {
  segment: string
  revenue: number
  orderCount: number
  customerCount: number
  averageOrderValue: number
}

export async function getRevenueByTime(
  startDate: Date,
  endDate: Date,
  interval: TimeInterval = 'day',
): Promise<RevenueDataPoint[]> {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: { not: 'CANCELLED' },
    },
    select: { createdAt: true, total: true },
  })

  const buckets = new Map<string, { revenue: number; count: number; sum: number }>()

  orders.forEach((order) => {
    const bucket = getDateBucket(order.createdAt, interval)
    const key = bucket.toISOString()

    if (!buckets.has(key)) {
      buckets.set(key, { revenue: 0, count: 0, sum: 0 })
    }

    const data = buckets.get(key)!
    data.revenue += order.total
    data.count += 1
    data.sum += order.total
  })

  const result: RevenueDataPoint[] = []
  let current = getDateBucket(startDate, interval)

  while (current <= endDate) {
    const key = current.toISOString()
    const data = buckets.get(key)
    result.push({
      date: formatDateLabel(current, interval),
      bucket: new Date(current),
      revenue: data?.revenue ?? 0,
      orderCount: data?.count ?? 0,
      averageOrderValue: data?.count ? data.revenue / data.count : 0,
    })
    current = addInterval(current, interval)
  }

  return result
}

export async function getRevenueBySegment(startDate: Date, endDate: Date): Promise<RevenueBySegment[]> {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: { not: 'CANCELLED' },
    },
    include: {
      customer: {
        select: { id: true, createdAt: true, orders: { select: { total: true } } },
      },
    },
  })

  const segmentMap = new Map<string, { revenue: number; orders: number; customers: Set<string> }>()

  orders.forEach((order) => {
    if (!order.customerId) return

    const lifetimeValue = order.customer?.orders.reduce((sum, o) => sum + (o.total || 0), 0) || 0
    let segment = 'REGULAR'

    if (lifetimeValue >= 5000) segment = 'VIP'
    else if (order.customer?.orders.length && order.customer.orders.length >= 5) segment = 'LOYAL'
    else if (new Date().getTime() - new Date(order.customer?.createdAt || 0).getTime() < 30 * 24 * 60 * 60 * 1000)
      segment = 'NEW'

    if (!segmentMap.has(segment)) {
      segmentMap.set(segment, { revenue: 0, orders: 0, customers: new Set() })
    }

    const data = segmentMap.get(segment)!
    data.revenue += order.total
    data.orders += 1
    data.customers.add(order.customerId)
  })

  return Array.from(segmentMap.entries()).map(([segment, data]) => ({
    segment,
    revenue: data.revenue,
    orderCount: data.orders,
    customerCount: data.customers.size,
    averageOrderValue: data.orders > 0 ? data.revenue / data.orders : 0,
  }))
}

export async function getRevenueMetrics(startDate: Date, endDate: Date) {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: { not: 'CANCELLED' },
    },
    select: { total: true },
  })

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const orderCount = orders.length

  return {
    totalRevenue,
    orderCount,
    averageOrderValue: orderCount > 0 ? totalRevenue / orderCount : 0,
  }
}

/**
 * Product Analytics
 */

export interface ProductPerformance {
  productId: string
  productName: string
  revenue: number
  unitsSold: number
  averagePrice: number
  category: string
}

export async function getTopProducts(
  startDate: Date,
  endDate: Date,
  limit: number = 10,
  metric: 'revenue' | 'units' = 'revenue',
): Promise<ProductPerformance[]> {
  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        createdAt: { gte: startDate, lte: endDate },
        status: { not: 'CANCELLED' },
      },
    },
    include: {
      product: { select: { id: true, name: true, categoryId: true, category: { select: { name: true } } } },
    },
  })

  const productMap = new Map<
    string,
    { name: string; revenue: number; units: number; prices: number[]; category: string }
  >()

  items.forEach((item) => {
    const key = item.productId
    if (!productMap.has(key)) {
      productMap.set(key, {
        name: item.product.name,
        revenue: 0,
        units: 0,
        prices: [],
        category: item.product.category?.name || 'Unknown',
      })
    }

    const data = productMap.get(key)!
    data.revenue += item.price * item.quantity
    data.units += item.quantity
    data.prices.push(item.price)
  })

  const products = Array.from(productMap.entries()).map(([id, data]) => ({
    productId: id,
    productName: data.name,
    revenue: data.revenue,
    unitsSold: data.units,
    averagePrice: data.prices.length > 0 ? data.prices.reduce((a, b) => a + b) / data.prices.length : 0,
    category: data.category,
  }))

  products.sort((a, b) => (metric === 'revenue' ? b.revenue - a.revenue : b.unitsSold - a.unitsSold))

  return products.slice(0, limit)
}

/**
 * Cohort Analysis
 */

export interface CohortData {
  cohort: string
  period0: number
  period1: number
  period2: number
  period3: number
  retention: number[]
}

export async function generateCohorts(startDate: Date, endDate: Date, interval: CohortInterval = 'month'): Promise<CohortData[]> {
  const customers = await prisma.customer.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
    },
    include: {
      orders: {
        select: { createdAt: true, total: true },
      },
    },
  })

  const cohortMap = new Map<string, { users: number; orders: Map<number, number> }>()

  customers.forEach((customer) => {
    const cohortBucket = getDateBucket(customer.createdAt, interval)
    const cohortKey = formatDateLabel(cohortBucket, interval)

    if (!cohortMap.has(cohortKey)) {
      cohortMap.set(cohortKey, { users: 0, orders: new Map() })
    }

    const cohort = cohortMap.get(cohortKey)!
    cohort.users += 1

    customer.orders.forEach((order) => {
      const orderBucket = getDateBucket(order.createdAt, interval)
      const periods = Math.floor(
        (orderBucket.getTime() - cohortBucket.getTime()) /
          (interval === 'month' ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000),
      )

      if (periods < 4) {
        cohort.orders.set(periods, (cohort.orders.get(periods) ?? 0) + 1)
      }
    })
  })

  return Array.from(cohortMap.entries())
    .map(([cohort, data]) => ({
      cohort,
      period0: data.users,
      period1: data.orders.get(0) ?? 0,
      period2: data.orders.get(1) ?? 0,
      period3: data.orders.get(2) ?? 0,
      retention: [
        100,
        data.users > 0 ? Math.round(((data.orders.get(0) ?? 0) / data.users) * 100) : 0,
        data.users > 0 ? Math.round(((data.orders.get(1) ?? 0) / data.users) * 100) : 0,
        data.users > 0 ? Math.round(((data.orders.get(2) ?? 0) / data.users) * 100) : 0,
      ],
    }))
    .sort((a, b) => new Date(b.cohort).getTime() - new Date(a.cohort).getTime())
}

/**
 * Customer Retention & RFM
 */

export interface RetentionMetrics {
  period: string
  newCustomers: number
  returningCustomers: number
  retentionRate: number
  repeatedPurchases: number
}

export async function getRetentionMetrics(
  startDate: Date,
  endDate: Date,
  interval: TimeInterval = 'month',
): Promise<RetentionMetrics[]> {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
    },
    include: {
      customer: { select: { id: true, createdAt: true } },
    },
  })

  const metricsMap = new Map<string, { newCount: number; returningCount: number; repeatedCount: number }>()

  orders.forEach((order) => {
    const bucket = getDateBucket(order.createdAt, interval)
    const key = formatDateLabel(bucket, interval)

    if (!metricsMap.has(key)) {
      metricsMap.set(key, { newCount: 0, returningCount: 0, repeatedCount: 0 })
    }

    const metrics = metricsMap.get(key)!
    if (order.customer) {
      const isNew = getDateBucket(order.customer.createdAt, interval).getTime() === bucket.getTime()
      if (isNew) {
        metrics.newCount += 1
      } else {
        metrics.returningCount += 1
      }

      const priorOrders = orders.filter(
        (o) =>
          o.customerId === order.customerId &&
          o.createdAt < order.createdAt &&
          getDateBucket(o.createdAt, interval).getTime() === bucket.getTime(),
      ).length

      if (priorOrders > 0) {
        metrics.repeatedCount += 1
      }
    }
  })

  let current = getDateBucket(startDate, interval)
  const result: RetentionMetrics[] = []

  while (current <= endDate) {
    const key = formatDateLabel(current, interval)
    const data = metricsMap.get(key)
    const newCount = data?.newCount ?? 0
    const returningCount = data?.returningCount ?? 0

    result.push({
      period: key,
      newCustomers: newCount,
      returningCustomers: returningCount,
      retentionRate: newCount + returningCount > 0 ? Math.round((returningCount / (newCount + returningCount)) * 100) : 0,
      repeatedPurchases: data?.repeatedCount ?? 0,
    })

    current = addInterval(current, interval)
  }

  return result
}

/**
 * RFM Analysis (Recency, Frequency, Monetary)
 */

export interface RFMScore {
  customerId: string
  customerName: string
  customerEmail: string
  recency: number // days since last purchase
  frequency: number // number of purchases
  monetary: number // total spent
  rfmScore: string // e.g., "554" (1-5 for each metric)
  rfmSegment: string // e.g., "Champions", "At Risk", "Lost"
  calculatedAt: Date
}

export interface RFMSegmentSummary {
  segment: string
  count: number
  avgRecency: number
  avgFrequency: number
  avgMonetary: number
  revenue: number
}

// RFM Score interpretation
function getRFMSegment(r: number, f: number, m: number): string {
  // Champions: high R, F, M
  if (r >= 4 && f >= 4 && m >= 4) return 'Champions'
  // Loyal: high on all metrics
  if (r >= 4 && f >= 3 && m >= 3) return 'Loyal Customers'
  // Potential Loyalists: good R and M but lower F
  if (r >= 4 && f >= 2 && m >= 3) return 'Potential Loyalists'
  // New Customers: high R but low F
  if (r >= 4 && f <= 2) return 'New Customers'
  // Promising: good R but low M
  if (r >= 3 && f >= 2 && m <= 2) return 'Promising'
  // Need Attention: medium R but declining
  if (r >= 3 && f <= 2 && m >= 2) return 'Need Attention'
  // At Risk: low R but high F/M
  if (r <= 2 && f >= 3 && m >= 3) return 'At Risk'
  // Cannot Lose: high M but low R
  if (r <= 2 && m >= 4) return 'Cannot Lose Them'
  // About to Sleep: low on all but was good
  if (r <= 2 && f >= 2 && m >= 2) return 'About to Sleep'
  // Lost: low on all metrics
  return 'Lost Customers'
}

export async function calculateRFMScores(referenceDate: Date = new Date()): Promise<RFMScore[]> {
  const customers = await prisma.customer.findMany({
    include: {
      orders: {
        select: { createdAt: true, total: true, status: true },
        where: { status: { not: 'CANCELLED' } },
      },
    },
  })

  const rfmScores: RFMScore[] = []

  customers.forEach((customer) => {
    if (customer.orders.length === 0) return

    // Calculate Recency (days since last purchase)
    const lastOrder = customer.orders.reduce((latest, order) =>
      order.createdAt > latest.createdAt ? order : latest,
    )
    const recencyDays = Math.floor((referenceDate.getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24))

    // Calculate Frequency (number of purchases)
    const frequency = customer.orders.length

    // Calculate Monetary (total spent)
    const monetary = customer.orders.reduce((sum, order) => sum + order.total, 0)

    // Calculate quartile-based scores (1-5 scale)
    // Note: In production, these would be calculated from actual quartile distribution
    // For now, using simplified logic
    const recencyScore = recencyDays <= 30 ? 5 : recencyDays <= 90 ? 4 : recencyDays <= 180 ? 3 : recencyDays <= 365 ? 2 : 1
    const frequencyScore = frequency >= 10 ? 5 : frequency >= 5 ? 4 : frequency >= 3 ? 3 : frequency >= 2 ? 2 : 1
    const monetaryScore = monetary >= 5000 ? 5 : monetary >= 2500 ? 4 : monetary >= 1000 ? 3 : monetary >= 500 ? 2 : 1

    const rfmScore = `${recencyScore}${frequencyScore}${monetaryScore}`
    const segment = getRFMSegment(recencyScore, frequencyScore, monetaryScore)

    rfmScores.push({
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      recency: recencyDays,
      frequency,
      monetary,
      rfmScore,
      rfmSegment: segment,
      calculatedAt: new Date(),
    })
  })

  return rfmScores
}

export async function getRFMSegmentSummary(referenceDate: Date = new Date()): Promise<RFMSegmentSummary[]> {
  const rfmScores = await calculateRFMScores(referenceDate)

  const segmentMap = new Map<string, { count: number; recency: number[]; frequency: number[]; monetary: number[] }>()

  rfmScores.forEach((score) => {
    if (!segmentMap.has(score.rfmSegment)) {
      segmentMap.set(score.rfmSegment, { count: 0, recency: [], frequency: [], monetary: [] })
    }

    const data = segmentMap.get(score.rfmSegment)!
    data.count += 1
    data.recency.push(score.recency)
    data.frequency.push(score.frequency)
    data.monetary.push(score.monetary)
  })

  return Array.from(segmentMap.entries()).map(([segment, data]) => ({
    segment,
    count: data.count,
    avgRecency: Math.round(data.recency.reduce((a, b) => a + b) / data.recency.length),
    avgFrequency: Math.round((data.frequency.reduce((a, b) => a + b) / data.frequency.length) * 100) / 100,
    avgMonetary: Math.round((data.monetary.reduce((a, b) => a + b) / data.monetary.length) * 100) / 100,
    revenue: Math.round(data.monetary.reduce((a, b) => a + b) * 100) / 100,
  }))
}

/**
 * Customer Lifetime Value (CLV)
 */

export interface CLVData {
  customerId: string
  customerName: string
  currentValue: number
  predictedValue: number
  churnRisk: number // 0-100 (percentage)
  ltv: number // predicted lifetime value
  valueSegment: string // high/medium/low
}

export async function calculateCLV(referenceDate: Date = new Date()): Promise<CLVData[]> {
  const customers = await prisma.customer.findMany({
    include: {
      orders: {
        select: { createdAt: true, total: true, status: true },
        where: { status: { not: 'CANCELLED' } },
      },
    },
  })

  const clvData: CLVData[] = []

  customers.forEach((customer) => {
    // Current value: total spent
    const currentValue = customer.orders.reduce((sum, order) => sum + order.total, 0)

    if (customer.orders.length === 0) return

    // Calculate average order value
    const aov = currentValue / customer.orders.length

    // Calculate customer lifetime (days)
    const firstOrder = customer.orders.reduce((earliest, order) =>
      order.createdAt < earliest.createdAt ? order : earliest,
    )
    const customerLifetimeDays = Math.floor((referenceDate.getTime() - firstOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Calculate purchase frequency per day
    const frequencyPerDay = customer.orders.length / Math.max(customerLifetimeDays, 1)

    // Predict future value (simplified: assume 2 more years of purchases at current rate)
    const daysInTwoYears = 730
    const predictedFutureValue = aov * frequencyPerDay * daysInTwoYears

    // Calculate churn risk (simplified logic)
    const lastOrder = customer.orders.reduce((latest, order) =>
      order.createdAt > latest.createdAt ? order : latest,
    )
    const daysSinceLastOrder = Math.floor((referenceDate.getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    const churnRisk = Math.min(100, Math.floor((daysSinceLastOrder / 365) * 100))

    // LTV = current value + (predicted value if not churned)
    const ltv = currentValue + (predictedFutureValue * (1 - churnRisk / 100))

    // Segment by LTV
    let valueSegment = 'low'
    if (ltv >= 10000) valueSegment = 'high'
    else if (ltv >= 3000) valueSegment = 'medium'

    clvData.push({
      customerId: customer.id,
      customerName: customer.name,
      currentValue,
      predictedValue: Math.round(predictedFutureValue * 100) / 100,
      churnRisk: Math.max(0, Math.min(100, churnRisk)),
      ltv: Math.round(ltv * 100) / 100,
      valueSegment,
    })
  })

  return clvData.sort((a, b) => b.ltv - a.ltv)
}

/**
 * Churn Prediction
 */

export interface ChurnPrediction {
  customerId: string
  customerName: string
  customerEmail: string
  churnProbability: number // 0-100 (percentage)
  churnRisk: 'low' | 'medium' | 'high' // risk level
  riskFactors: string[] // e.g., ["No purchase in 60+ days", "Declining purchase frequency"]
  lastOrderDate: Date
  daysSinceLastOrder: number
  predictedChurnDate: Date | null
}

interface ChurnIndicators {
  daysSinceLastOrder: number
  purchaseFrequencyDecline: number // percentage
  pricePointShift: number // percentage change in avg order value
  supportTickets: number
}

function calculateChurnProbability(indicators: ChurnIndicators): number {
  let probability = 0

  // Days since last order (heavily weighted)
  if (indicators.daysSinceLastOrder > 365) probability += 40
  else if (indicators.daysSinceLastOrder > 180) probability += 25
  else if (indicators.daysSinceLastOrder > 90) probability += 15
  else if (indicators.daysSinceLastOrder > 30) probability += 5

  // Purchase frequency decline
  probability += Math.min(30, indicators.purchaseFrequencyDecline * 1.5)

  // Price point shift (downward = negative indicator)
  if (indicators.pricePointShift < -20) probability += 10
  else if (indicators.pricePointShift < -10) probability += 5

  return Math.min(100, probability)
}

export async function predictChurn(daysThreshold: number = 90): Promise<ChurnPrediction[]> {
  const referenceDate = new Date()
  const thresholdDate = new Date(referenceDate.getTime() - daysThreshold * 24 * 60 * 60 * 1000)

  const customers = await prisma.customer.findMany({
    include: {
      orders: {
        select: { createdAt: true, total: true, status: true },
        where: { status: { not: 'CANCELLED' } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  const churnPredictions: ChurnPrediction[] = []

  customers.forEach((customer) => {
    if (customer.orders.length < 2) return // Need at least 2 orders to detect patterns

    const lastOrder = customer.orders[0]
    const daysSinceLastOrder = Math.floor((referenceDate.getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24))

    // Calculate purchase frequency trend
    const recentOrders = customer.orders.filter((o) => {
      const orderDate = o.createdAt
      return orderDate >= thresholdDate
    }).length

    const olderOrders = customer.orders.filter((o) => {
      const orderDate = o.createdAt
      return orderDate < thresholdDate && orderDate >= new Date(thresholdDate.getTime() - daysThreshold * 24 * 60 * 60 * 1000)
    }).length

    const frequencyDecline = olderOrders > 0 ? Math.max(0, ((olderOrders - recentOrders) / olderOrders) * 100) : 0

    // Calculate price point shift
    const recentAvgPrice = recentOrders > 0 ? customer.orders.slice(0, recentOrders).reduce((sum, o) => sum + o.total, 0) / recentOrders : 0
    const olderAvgPrice = olderOrders > 0 ? customer.orders.slice(recentOrders, recentOrders + olderOrders).reduce((sum, o) => sum + o.total, 0) / olderOrders : 0
    const priceShift = olderAvgPrice > 0 ? ((recentAvgPrice - olderAvgPrice) / olderAvgPrice) * 100 : 0

    const indicators: ChurnIndicators = {
      daysSinceLastOrder,
      purchaseFrequencyDecline: frequencyDecline,
      pricePointShift: priceShift,
      supportTickets: 0, // Would be populated from support system
    }

    const churnProbability = calculateChurnProbability(indicators)

    // Determine risk level
    let churnRisk: 'low' | 'medium' | 'high' = 'low'
    if (churnProbability >= 60) churnRisk = 'high'
    else if (churnProbability >= 35) churnRisk = 'medium'

    // Identify risk factors
    const riskFactors: string[] = []
    if (daysSinceLastOrder > 90) riskFactors.push(`No purchase in ${daysSinceLastOrder}+ days`)
    if (frequencyDecline > 30) riskFactors.push(`Purchase frequency declined by ${Math.round(frequencyDecline)}%`)
    if (priceShift < -20) riskFactors.push(`Average order value decreased by ${Math.round(Math.abs(priceShift))}%`)
    if (recentOrders === 0 && olderOrders > 0) riskFactors.push('No purchases in recent period')

    // Predict churn date (estimated based on average purchase interval)
    let predictedChurnDate: Date | null = null
    if (customer.orders.length >= 2) {
      const intervals: number[] = []
      for (let i = 0; i < customer.orders.length - 1; i++) {
        const interval = Math.floor(
          (customer.orders[i].createdAt.getTime() - customer.orders[i + 1].createdAt.getTime()) / (1000 * 60 * 60 * 24),
        )
        intervals.push(interval)
      }

      if (intervals.length > 0) {
        const avgInterval = Math.round(intervals.reduce((a, b) => a + b) / intervals.length)
        predictedChurnDate = new Date(lastOrder.createdAt.getTime() + avgInterval * 2 * 24 * 60 * 60 * 1000)
      }
    }

    if (churnProbability > 20 || daysSinceLastOrder > 180) {
      churnPredictions.push({
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        churnProbability: Math.round(churnProbability),
        churnRisk,
        riskFactors,
        lastOrderDate: lastOrder.createdAt,
        daysSinceLastOrder,
        predictedChurnDate,
      })
    }
  })

  return churnPredictions.sort((a, b) => b.churnProbability - a.churnProbability)
}