import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
    const [
      products,
      categories,
      orders,
      users,
      reviews,
      coupons,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.review.count(),
      prisma.coupon.count(),
    ])

    const now = new Date().toISOString()

    return NextResponse.json({
      status: "ok",
      timestamp: now,
      counts: {
        products,
        categories,
        orders,
        users,
        reviews,
        coupons,
      },
    })
  } catch (error) {
    console.error("/api/admin/health error", error)
    return NextResponse.json(
      { status: "error", message: "Health check failed" },
      { status: 500 }
    )
  }
}
