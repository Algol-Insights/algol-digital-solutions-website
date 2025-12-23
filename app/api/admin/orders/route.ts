import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin, handleAdminError } from '@/lib/admin-auth'
import { logAuditEvent } from '@/lib/audit'

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request, 'admin:orders:read')

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'))
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build filters
    const where: any = {}

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // Fetch orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: true,
          orderItems: {
            include: {
              product: {
                select: { id: true, name: true, image: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    // Fetch summary statistics (use aggregation instead of loading all)
    const stats = await Promise.all([
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'SHIPPED' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
      prisma.order.aggregate({ _sum: { total: true } }),
    ])

    const [pending, processing, shipped, delivered, cancelled, totalRevenue] = stats

    const response = NextResponse.json({
      orders: orders.map((order) => ({
        ...order,
        shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      summary: {
        totalOrders: total,
        totalRevenue: totalRevenue._sum.total || 0,
        pending,
        processing,
        shipped,
        delivered,
        cancelled,
      },
    })

    await logAuditEvent({
      userId: admin.userId,
      action: 'ORDERS_VIEW',
      targetType: 'ORDER',
      status: 'SUCCESS',
      ip: admin.ip,
      userAgent: admin.userAgent,
      metadata: { page, limit, status: status || 'all' },
    })

    return response
  } catch (error) {
    console.error('Orders API error:', error)
    await logAuditEvent({
      action: 'ORDERS_VIEW',
      targetType: 'ORDER',
      status: 'FAIL',
      metadata: { message: error instanceof Error ? error.message : 'Unknown error' },
    })
    if ((error as any)?.status) {
      return handleAdminError(error)
    }
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
