import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Generate CSV
    const headers = [
      'Code',
      'Description',
      'Type',
      'Value',
      'Min Purchase',
      'Max Discount',
      'Usage Count',
      'Usage Limit',
      'Valid From',
      'Valid Until',
      'Is Active',
      'Created At',
    ]

    const rows = coupons.map((coupon) => [
      coupon.code,
      coupon.description || '',
      coupon.type,
      coupon.value.toString(),
      coupon.minPurchase.toString(),
      coupon.maxDiscount?.toString() || '',
      coupon.usageCount.toString(),
      coupon.usageLimit?.toString() || '',
      new Date(coupon.validFrom).toISOString(),
      new Date(coupon.validUntil).toISOString(),
      coupon.isActive.toString(),
      new Date(coupon.createdAt).toISOString(),
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="coupons_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Coupon export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
