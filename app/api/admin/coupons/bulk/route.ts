import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { ids, action } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid coupon IDs' }, { status: 400 })
    }

    if (!['activate', 'deactivate', 'delete', 'extend'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    let result: any = null

    switch (action) {
      case 'activate':
        result = await prisma.coupon.updateMany({
          where: { id: { in: ids } },
          data: { isActive: true },
        })
        break

      case 'deactivate':
        result = await prisma.coupon.updateMany({
          where: { id: { in: ids } },
          data: { isActive: false },
        })
        break

      case 'delete':
        result = await prisma.coupon.deleteMany({
          where: { id: { in: ids } },
        })
        break

      case 'extend':
        // Extend validity by 30 days
        const coupons = await prisma.coupon.findMany({
          where: { id: { in: ids } },
          select: { id: true, validUntil: true },
        })

        const updates = await Promise.all(
          coupons.map((coupon) => {
            const newDate = new Date(coupon.validUntil)
            newDate.setDate(newDate.getDate() + 30)
            return prisma.coupon.update({
              where: { id: coupon.id },
              data: { validUntil: newDate },
            })
          })
        )

        result = { count: updates.length }
        break
    }

    return NextResponse.json({
      success: true,
      count: result?.count || 0,
      message: `Successfully ${action}d ${result?.count || 0} coupon(s)`,
    })
  } catch (error) {
    console.error('Bulk coupon operation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
