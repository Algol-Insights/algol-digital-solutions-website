import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { sendOrderConfirmationEmail, sendShippingNotificationEmail } from "@/lib/email-notifications-v2"

interface OrderItemInput {
  productId: string
  quantity: number
}

// GET /api/orders - Fetch all orders for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    // Fetch orders for the user
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                images: true,
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                color: true,
                size: true,
                storage: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate order statistics
    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'PENDING').length,
      processing: orders.filter((o) => o.status === 'PROCESSING').length,
      shipped: orders.filter((o) => o.status === 'SHIPPED').length,
      delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    };

    return NextResponse.json({
      orders,
      stats,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order from cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      tax = 0,
      shipping = 0,
      paymentMethod = "PENDING",
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      )
    }

    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { error: "Customer email and name are required" },
        { status: 400 }
      )
    }

    // Get or create customer
    let customer = await prisma.customer.findUnique({
      where: { email: customerEmail },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: customerEmail,
          name: customerName,
          phone: customerPhone || null,
          addressLine1: shippingAddress?.addressLine1 || "",
          addressLine2: shippingAddress?.addressLine2 || null,
          city: shippingAddress?.city || "",
          state: shippingAddress?.state || "",
          postalCode: shippingAddress?.postalCode || "",
          country: shippingAddress?.country || "",
        },
      })
    }

    // Verify all products exist and have sufficient stock
    const productIds = items.map((item: OrderItemInput) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }
    }

    // Calculate total
    const total = parseFloat(subtotal) + tax + shipping

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        customerId: customer.id,
        subtotal: parseFloat(subtotal),
        tax,
        shipping,
        total,
        status: "PENDING",
        paymentMethod,
        paymentStatus: "PENDING",
        shippingAddress: JSON.stringify(shippingAddress || {}),
        orderItems: {
          create: items.map((item: OrderItemInput) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: productMap.get(item.productId)!.price,
          })),
        },
      },
      include: {
        customer: true,
        orderItems: {
          include: { product: true },
        },
      },
    })

    // Update product stock and log inventory changes
    for (const item of items) {
      const product = productMap.get(item.productId)!
      const newStock = product.stock - item.quantity

      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: newStock },
      })

      await prisma.inventoryLog.create({
        data: {
          productId: item.productId,
          previousStock: product.stock,
          newStock,
          change: -item.quantity,
          reason: "ORDER_PLACED",
        },
      })
    }

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(
        customerEmail,
        {
          orderNumber: order.orderNumber,
          orderId: order.id,
          total: order.total,
          subtotal: order.subtotal,
          tax: order.tax,
          shipping: order.shipping,
          items: order.orderItems.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            image: item.product.image || undefined,
          })),
          shippingAddress: shippingAddress ? 
            `${shippingAddress.addressLine1}\n${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}\n${shippingAddress.country}` 
            : undefined,
          estimatedDelivery: order.estimatedDelivery || undefined,
        }
      )
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
      // Don't fail the order if email fails
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create order"
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
