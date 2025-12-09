import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

// GET /api/orders/[id] - Fetch single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderItems: {
          include: { product: true },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
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
