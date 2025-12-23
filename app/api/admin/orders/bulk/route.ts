import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role?.toString().toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { ids, status, paymentStatus } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Order IDs required' }, { status: 400 })
    }

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updates: any = {}
    if (status) updates.status = status
    if (paymentStatus) updates.paymentStatus = paymentStatus
    if (status === 'DELIVERED') updates.deliveredAt = new Date()

    const result = await prisma.order.updateMany({
      where: { id: { in: ids } },
      data: updates,
    })

    // Fetch updated orders to return
    const updatedOrders = await prisma.order.findMany({
      where: { id: { in: ids } },
      include: {
        customer: true,
        orderItems: {
          include: { product: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      updated: result.count,
      orders: updatedOrders.map((o) => ({
        ...o,
        shippingAddress: o.shippingAddress ? JSON.parse(o.shippingAddress) : null,
      })),
    })
  } catch (error) {
    console.error('Bulk update API error:', error)
    return NextResponse.json({ error: 'Failed to bulk update orders' }, { status: 500 })
  }
}
