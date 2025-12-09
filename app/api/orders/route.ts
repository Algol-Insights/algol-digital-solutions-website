import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

interface OrderItemInput {
  productId: string
  quantity: number
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

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

// GET /api/orders - List orders (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const where: any = {}
    if (email) where.customer = { email }
    if (status) where.status = status

    const total = await prisma.order.count({ where })
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        customer: true,
        orderItems: {
          include: { product: true },
        },
      },
    })

    return NextResponse.json({
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
