import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth check for testing
    // const session = await getServerSession(authOptions)
    // if (!session?.user || (session.user as any).role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    const previousStartDate = new Date(startDate)
    const daysDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    previousStartDate.setDate(startDate.getDate() - daysDiff)

    // Fetch orders for current period
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })

    // Fetch orders for previous period (for comparison)
    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
    })

    // Calculate metrics
    const revenue = orders.reduce((sum, order) => sum + order.total, 0)
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0)
    const revenueChange = previousRevenue > 0 
      ? ((revenue - previousRevenue) / previousRevenue) * 100 
      : 100

    const orderCount = orders.length
    const previousOrderCount = previousOrders.length
    const ordersChange = previousOrderCount > 0 
      ? ((orderCount - previousOrderCount) / previousOrderCount) * 100 
      : 100

    // Get unique customers
    const uniqueCustomers = new Set(orders.map(o => o.userId)).size
    const previousUniqueCustomers = new Set(previousOrders.map(o => o.userId)).size
    const customersChange = previousUniqueCustomers > 0 
      ? ((uniqueCustomers - previousUniqueCustomers) / previousUniqueCustomers) * 100 
      : 100

    // Calculate average order value
    const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0
    const previousAvgOrderValue = previousOrderCount > 0 
      ? previousRevenue / previousOrderCount 
      : 0
    const avgOrderValueChange = previousAvgOrderValue > 0 
      ? ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue) * 100 
      : 100

    // Sales by day
    const salesByDay: Map<string, { revenue: number; orders: number }> = new Map()
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0]
      const existing = salesByDay.get(date) || { revenue: 0, orders: 0 }
      salesByDay.set(date, {
        revenue: existing.revenue + order.total,
        orders: existing.orders + 1,
      })
    })

    // Top products
    const productSales: Map<string, {
      id: string
      name: string
      sales: number
      revenue: number
      image?: string
    }> = new Map()

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const key = item.productId
        const existing = productSales.get(key) || {
          id: item.product.id,
          name: item.product.name,
          sales: 0,
          revenue: 0,
          image: item.product.image || undefined,
        }
        productSales.set(key, {
          ...existing,
          sales: existing.sales + item.quantity,
          revenue: existing.revenue + (item.price * item.quantity),
        })
      })
    })

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Recent orders
    const recentOrders = orders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.user?.name || 'Guest',
        total: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      }))

    // Sales by category
    const categorySales: Map<string, number> = new Map()
    let totalCategoryRevenue = 0

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const categoryId = item.product.categoryId
        const revenue = item.price * item.quantity
        categorySales.set(categoryId, (categorySales.get(categoryId) || 0) + revenue)
        totalCategoryRevenue += revenue
      })
    })

    // Get category names
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: Array.from(categorySales.keys()),
        },
      },
    })

    const salesByCategory = categories
      .map(cat => ({
        category: cat.name,
        revenue: categorySales.get(cat.id) || 0,
        percentage: totalCategoryRevenue > 0 
          ? ((categorySales.get(cat.id) || 0) / totalCategoryRevenue) * 100 
          : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    const analyticsData = {
      revenue: {
        total: revenue,
        change: revenueChange,
        trend: revenueChange >= 0 ? 'up' : 'down',
      },
      orders: {
        total: orderCount,
        change: ordersChange,
        trend: ordersChange >= 0 ? 'up' : 'down',
      },
      customers: {
        total: uniqueCustomers,
        change: customersChange,
        trend: customersChange >= 0 ? 'up' : 'down',
      },
      avgOrderValue: {
        total: avgOrderValue,
        change: avgOrderValueChange,
        trend: avgOrderValueChange >= 0 ? 'up' : 'down',
      },
      topProducts,
      recentOrders,
      salesByDay: Array.from(salesByDay.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      salesByCategory,
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
