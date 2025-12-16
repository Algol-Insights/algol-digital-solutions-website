import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { calculateCouponDiscount } from '@/lib/coupons'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    const { code, subtotal, shippingCost } = await request.json()

    if (!code || !subtotal) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      )
    }

    // Find coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      return Response.json({
        valid: false,
        discount: 0,
        message: 'Invalid coupon code',
      })
    }

    // Calculate discount
    const result = calculateCouponDiscount(coupon!, subtotal, (shippingCost as number) || 0)

    return Response.json(result)
  } catch (error: any) {
    console.error('Coupon validation error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to validate coupon' }),
      { status: 500 }
    )
  }
}
