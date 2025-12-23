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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          coupons: {
            include: {
              coupon: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.campaign.count({ where }),
    ])

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Failed to fetch campaigns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Validation
    if (!data.name || !data.startDate || !data.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: name, startDate, endDate' },
        { status: 400 }
      )
    }

    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)

    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      )
    }

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status || 'DRAFT',
        targetingType: data.targetingType || 'ALL_CUSTOMERS',
        targetSegment: data.targetSegment,
        targetValue: data.targetValue,
        startDate,
        endDate,
        budget: data.budget,
        expectedROI: data.expectedROI,
      },
      include: {
        coupons: {
          include: {
            coupon: true,
          },
        },
      },
    })

    // Add coupons if provided
    if (data.couponIds && Array.isArray(data.couponIds)) {
      for (const couponId of data.couponIds) {
        await prisma.campaignCoupon.create({
          data: {
            campaignId: campaign.id,
            couponId,
          },
        })
      }
    }

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Failed to create campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
