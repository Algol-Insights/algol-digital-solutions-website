import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { sendShippingNotificationEmail } from '@/lib/email-notifications-v2'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role?.toString().toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true, image: true, price: true },
            },
            variant: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...order,
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
    })
  } catch (error) {
    console.error('Order detail API error:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role?.toString().toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, paymentStatus, estimatedDelivery, reason } = body

    const order = await prisma.order.findUnique({
      where: { id },
      include: { customer: true, orderItems: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Validate status transition
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(estimatedDelivery && { estimatedDelivery: new Date(estimatedDelivery) }),
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
      },
      include: {
        customer: true,
        orderItems: {
          include: { product: true },
        },
      },
    })

    // Send notification email if status changed to SHIPPED
    if (status === 'SHIPPED' && order.status !== 'SHIPPED' && order.customer) {
      try {
        if (updatedOrder.estimatedDelivery) {
          await sendShippingNotificationEmail(order.customer.email, {
            orderNumber: order.orderNumber,
            orderId: order.id,
            estimatedDelivery: updatedOrder.estimatedDelivery,
          })
        }
      } catch (emailError) {
        console.error('Failed to send shipping email:', emailError)
      }
    }

    return NextResponse.json({
      ...updatedOrder,
      shippingAddress: updatedOrder.shippingAddress ? JSON.parse(updatedOrder.shippingAddress) : null,
    })
  } catch (error) {
    console.error('Order update API error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
