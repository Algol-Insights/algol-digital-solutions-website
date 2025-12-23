import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaigns = await prisma.campaign.findMany({
      include: {
        coupons: {
          include: {
            coupon: true,
          },
        },
      },
    })

    // Calculate analytics
    const analytics = campaigns.map((campaign) => {
      const roi = campaign.budget && campaign.revenue
        ? ((campaign.revenue - campaign.budget) / campaign.budget) * 100
        : 0

      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        conversions: campaign.conversions,
        clickThrough: campaign.impressions > 0 
          ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2)
          : 0,
        conversionRate: campaign.clicks > 0 
          ? ((campaign.conversions / campaign.clicks) * 100).toFixed(2)
          : 0,
        revenue: campaign.revenue,
        budget: campaign.budget,
        actualROI: roi.toFixed(2),
        expectedROI: campaign.expectedROI,
      }
    })

    // Calculate overall stats
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0)
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0)
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0)
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0)

    const overallStats = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === 'ACTIVE').length,
      totalImpressions,
      totalClicks,
      totalConversions,
      avgClickThrough: totalImpressions > 0 
        ? ((totalClicks / totalImpressions) * 100).toFixed(2)
        : 0,
      avgConversionRate: totalClicks > 0 
        ? ((totalConversions / totalClicks) * 100).toFixed(2)
        : 0,
      totalRevenue,
      totalBudget,
      overallROI: totalBudget > 0 
        ? (((totalRevenue - totalBudget) / totalBudget) * 100).toFixed(2)
        : 0,
    }

    return NextResponse.json({
      analytics,
      overallStats,
    })
  } catch (error) {
    console.error('Failed to fetch campaign analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
