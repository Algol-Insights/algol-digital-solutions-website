import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    const data = await request.json()

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: data.code?.toUpperCase(),
        description: data.description,
        type: data.type,
        value: data.value ? parseFloat(data.value) : undefined,
        minPurchase: data.minPurchase !== undefined ? parseFloat(data.minPurchase) : undefined,
        maxDiscount: data.maxDiscount ? parseFloat(data.maxDiscount) : null,
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
        isActive: data.isActive,
      },
    })

    return Response.json(coupon)
  } catch (error: any) {
    console.error('Update coupon error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to update coupon' }),
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    await prisma.coupon.delete({
      where: { id },
    })

    return Response.json({ success: true })
  } catch (error: any) {
    console.error('Delete coupon error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to delete coupon' }),
      { status: 500 }
    )
  }
}
