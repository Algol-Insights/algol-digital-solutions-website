import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"

// GET /api/orders/[id] - Fetch single order with authentication
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                images: true,
                brand: true,
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                color: true,
                size: true,
                storage: true,
                image: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // If user is logged in, verify they own this order
    if (session && session.user) {
      const userId = (session.user as any).id;
      if (order.userId && order.userId !== userId) {
        return NextResponse.json(
          { error: "Unauthorized. This order does not belong to you." },
          { status: 403 }
        );
      }
    }

    // Parse shipping address if it's a JSON string
    let shippingAddress = null;
    if (order.shippingAddress) {
      try {
        shippingAddress = JSON.parse(order.shippingAddress);
      } catch (e) {
        shippingAddress = order.shippingAddress;
      }
    }

    return NextResponse.json({
      ...order,
      shippingAddress,
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, paymentStatus, estimatedDelivery, deliveredAt } = body

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(estimatedDelivery && { estimatedDelivery: new Date(estimatedDelivery) }),
        ...(deliveredAt && { deliveredAt: new Date(deliveredAt) }),
      },
      include: {
        customer: true,
        orderItems: {
          include: { product: true },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}

// DELETE /api/orders/[id] - Cancel order (if applicable)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // Only allow cancellation if order is still pending
    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only cancel pending orders" },
        { status: 400 }
      )
    }

    // Restore inventory for all items
    for (const item of order.orderItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (product) {
        const newStock = product.stock + item.quantity

        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: newStock },
        })

        await prisma.inventoryLog.create({
          data: {
            productId: item.productId,
            previousStock: product.stock,
            newStock,
            change: item.quantity,
            reason: "ORDER_CANCELLED",
          },
        })
      }
    }

    // Update order status
    const cancelledOrder = await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: {
        customer: true,
        orderItems: {
          include: { product: true },
        },
      },
    })

    return NextResponse.json(cancelledOrder)
  } catch (error) {
    console.error("Error cancelling order:", error)
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    )
  }
}
