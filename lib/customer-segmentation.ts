import { prisma } from '@/lib/db/prisma'

export enum CustomerSegment {
  VIP = 'VIP',
  LOYAL = 'LOYAL',
  NEW = 'NEW',
  AT_RISK = 'AT_RISK',
  INACTIVE = 'INACTIVE',
  REGULAR = 'REGULAR',
}

export interface CustomerSegmentConfig {
  vipMinSpent: number // Minimum lifetime value for VIP
  loyalMinOrders: number // Minimum orders for loyal
  newDaysThreshold: number // Days since signup to be "new"
  atRiskDaysNoOrder: number // Days without order to be "at risk"
  inactiveDaysThreshold: number // Days without order to be "inactive"
}

export const defaultSegmentConfig: CustomerSegmentConfig = {
  vipMinSpent: 5000, // $5000+ lifetime value
  loyalMinOrders: 5, // 5+ orders
  newDaysThreshold: 30, // New if joined in last 30 days
  atRiskDaysNoOrder: 60, // At risk if no order in 60 days
  inactiveDaysThreshold: 180, // Inactive if no order in 180 days
}

export interface CustomerWithMetrics {
  id: string
  email: string
  name: string
  phone: string | null
  city: string | null
  country: string | null
  createdAt: Date
  updatedAt: Date
  totalOrders: number
  lifetimeValue: number
  averageOrderValue: number
  lastOrderDate: Date | null
  segment: CustomerSegment
}

export async function calculateCustomerMetrics(
  customerId: string
): Promise<Omit<CustomerWithMetrics, 'id' | 'email' | 'name' | 'phone' | 'city' | 'country' | 'createdAt' | 'updatedAt'>> {
  const orders = await prisma.order.findMany({
    where: { customerId },
    select: { total: true, createdAt: true },
  })

  const totalOrders = orders.length
  const lifetimeValue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const averageOrderValue = totalOrders > 0 ? lifetimeValue / totalOrders : 0
  const lastOrderDate = orders.length > 0 ? new Date(Math.max(...orders.map((o) => o.createdAt.getTime()))) : null

  return {
    totalOrders,
    lifetimeValue,
    averageOrderValue,
    lastOrderDate,
    segment: CustomerSegment.REGULAR, // Will be updated by segmentation logic
  }
}

export function determineSegment(
  customer: any,
  metrics: any,
  config: CustomerSegmentConfig = defaultSegmentConfig
): CustomerSegment {
  const now = new Date()
  const daysSinceCreated = (now.getTime() - new Date(customer.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  const daysSinceLastOrder = metrics.lastOrderDate
    ? (now.getTime() - new Date(metrics.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24)
    : Infinity

  // Check segments in priority order
  if (daysSinceLastOrder > config.inactiveDaysThreshold) {
    return CustomerSegment.INACTIVE
  }

  if (daysSinceLastOrder > config.atRiskDaysNoOrder) {
    return CustomerSegment.AT_RISK
  }

  if (metrics.lifetimeValue >= config.vipMinSpent) {
    return CustomerSegment.VIP
  }

  if (metrics.totalOrders >= config.loyalMinOrders) {
    return CustomerSegment.LOYAL
  }

  if (daysSinceCreated <= config.newDaysThreshold && metrics.totalOrders > 0) {
    return CustomerSegment.NEW
  }

  return CustomerSegment.REGULAR
}

export async function getCustomersWithSegmentation(
  filters?: {
    segment?: CustomerSegment
    search?: string
    minLifetimeValue?: number
    maxLifetimeValue?: number
    startDate?: Date
    endDate?: Date
  },
  pagination?: {
    page: number
    limit: number
  },
  config: CustomerSegmentConfig = defaultSegmentConfig
): Promise<{
  customers: CustomerWithMetrics[]
  total: number
  pagination: { page: number; limit: number; total: number; pages: number }
}> {
  const page = pagination?.page || 1
  const limit = Math.min(pagination?.limit || 20, 100)
  const skip = (page - 1) * limit

  // Get all customers with basic info
  let customers = await prisma.customer.findMany({
    include: {
      orders: {
        select: { total: true, createdAt: true },
      },
    },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  })

  // Calculate metrics for each customer
  const customersWithMetrics = customers.map((customer) => {
    const orders = customer.orders
    const totalOrders = orders.length
    const lifetimeValue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const averageOrderValue = totalOrders > 0 ? lifetimeValue / totalOrders : 0
    const lastOrderDate = orders.length > 0 ? new Date(Math.max(...orders.map((o) => o.createdAt.getTime()))) : null

    const metrics = {
      totalOrders,
      lifetimeValue,
      averageOrderValue,
      lastOrderDate,
    }

    const segment = determineSegment(customer, metrics, config)

    return {
      ...customer,
      ...metrics,
      segment,
      orders: undefined, // Remove raw orders array
    }
  })

  // Apply filters
  let filtered = customersWithMetrics

  if (filters?.segment) {
    filtered = filtered.filter((c) => c.segment === filters.segment)
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(
      (c) => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search)
    )
  }

  if (filters?.minLifetimeValue !== undefined) {
    filtered = filtered.filter((c) => c.lifetimeValue >= filters.minLifetimeValue!)
  }

  if (filters?.maxLifetimeValue !== undefined) {
    filtered = filtered.filter((c) => c.lifetimeValue <= filters.maxLifetimeValue!)
  }

  if (filters?.startDate) {
    filtered = filtered.filter((c) => new Date(c.createdAt) >= filters.startDate!)
  }

  if (filters?.endDate) {
    filtered = filtered.filter((c) => new Date(c.createdAt) <= filters.endDate!)
  }

  const total = filtered.length

  return {
    customers: filtered,
    total,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export async function getCustomerInsights(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      orders: {
        include: {
          orderItems: {
            include: {
              product: { select: { name: true, category: { select: { name: true } } } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!customer) return null

  const metrics = await calculateCustomerMetrics(customerId)
  const segment = determineSegment(customer, metrics)

  // Calculate category preferences
  const categorySpending: Record<string, { count: number; spent: number }> = {}
  customer.orders.forEach((order) => {
    order.orderItems.forEach((item) => {
      const categoryName = item.product.category?.name || 'Uncategorized'
      if (!categorySpending[categoryName]) {
        categorySpending[categoryName] = { count: 0, spent: 0 }
      }
      categorySpending[categoryName].count += item.quantity
      categorySpending[categoryName].spent += item.price
    })
  })

  // Calculate repeat purchase rate
  const repeatPurchaseRate = metrics.totalOrders > 1 ? ((metrics.totalOrders - 1) / metrics.totalOrders) * 100 : 0

  // Calculate order frequency (orders per month)
  const accountAgeMonths =
    (new Date().getTime() - new Date(customer.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
  const orderFrequency = accountAgeMonths > 0 ? metrics.totalOrders / accountAgeMonths : 0

  return {
    customer,
    metrics: { ...metrics, segment },
    insights: {
      categoryPreferences: Object.entries(categorySpending)
        .sort((a, b) => b[1].spent - a[1].spent)
        .slice(0, 5),
      repeatPurchaseRate,
      orderFrequency,
      riskLevel:
        segment === CustomerSegment.AT_RISK || segment === CustomerSegment.INACTIVE ? 'high' : 'low',
    },
  }
}
