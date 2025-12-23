import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { getCustomersWithSegmentation, CustomerSegment } from '@/lib/customer-segmentation'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role?.toString().toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'))
    const segment = searchParams.get('segment') as CustomerSegment | null
    const search = searchParams.get('search')
    const minLifetimeValue = searchParams.get('minLifetimeValue')
    const maxLifetimeValue = searchParams.get('maxLifetimeValue')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build filters
    const filters: any = {}
    if (segment) filters.segment = segment
    if (search) filters.search = search
    if (minLifetimeValue) filters.minLifetimeValue = parseInt(minLifetimeValue)
    if (maxLifetimeValue) filters.maxLifetimeValue = parseInt(maxLifetimeValue)
    if (startDate) filters.startDate = new Date(startDate)
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      filters.endDate = end
    }

    // Get customers with segmentation
    const result = await getCustomersWithSegmentation(filters, { page, limit })

    // Calculate summary stats
    const allCustomers = await prisma.customer.findMany({
      include: {
        orders: { select: { total: true, createdAt: true } },
      },
    })

    const summary = {
      totalCustomers: allCustomers.length,
      totalRevenue: allCustomers.reduce(
        (sum, c) => sum + c.orders.reduce((orderSum, o) => orderSum + (o.total || 0), 0),
        0
      ),
      averageLifetimeValue: allCustomers.length
        ? allCustomers.reduce(
            (sum, c) => sum + c.orders.reduce((orderSum, o) => orderSum + (o.total || 0), 0),
            0
          ) / allCustomers.length
        : 0,
      segmentCounts: {
        VIP: allCustomers.filter(
          (c) => c.orders.reduce((sum, o) => sum + (o.total || 0), 0) >= 5000 && c.orders.length > 0
        ).length,
        LOYAL: allCustomers.filter((c) => c.orders.length >= 5).length,
        NEW: allCustomers.filter(
          (c) =>
            (new Date().getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24) <= 30 &&
            c.orders.length > 0
        ).length,
        INACTIVE: allCustomers.filter(
          (c) =>
            c.orders.length === 0 ||
            (new Date().getTime() - new Date(c.orders[c.orders.length - 1]?.createdAt || c.createdAt).getTime()) /
              (1000 * 60 * 60 * 24) >
              180
        ).length,
      },
    }

    return NextResponse.json({
      customers: result.customers,
      summary,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('Get customers error:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
