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

    // Get all coupons with their usage in campaigns
    const coupons = await prisma.coupon.findMany({
      include: {
        campaigns: {
          select: {
            campaign: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    // Calculate analytics
    const analytics = coupons.map((coupon) => {
      const usageCount = coupon.usageCount || 0
      const redemptionRate = coupon.usageLimit
        ? (usageCount / coupon.usageLimit) * 100
        : 0
      const campaignCount = coupon.campaigns.length

      return {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        isActive: coupon.isActive,
        usageCount,
        usageLimit: coupon.usageLimit,
        redemptionRate,
        campaignCount,
        validFrom: coupon.validFrom,
        validUntil: coupon.validUntil,
      }
    })

    // Sort by usage count
    analytics.sort((a, b) => b.usageCount - a.usageCount)

    // Calculate overall stats
    const overallStats = {
      totalCoupons: coupons.length,
      activeCoupons: coupons.filter((c) => c.isActive).length,
      totalUsage: analytics.reduce((sum, c) => sum + c.usageCount, 0),
      avgRedemptionRate:
        analytics.reduce((sum, c) => sum + c.redemptionRate, 0) / (analytics.length || 1),
    }

    return NextResponse.json({
      analytics,
      overallStats,
    })
  } catch (error) {
    console.error('Coupon analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
