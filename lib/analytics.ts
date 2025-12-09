/**
 * Sales and customer analytics system
 */

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
export async function getTopProducts(
  limit: number = 10,
  dateRange?: DateRange,
): Promise<ProductAnalytics[]> {
  // In production, query database
  return mockAnalyticsData.topProducts.slice(0, limit)
}

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
