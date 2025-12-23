import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth'
import { ABTestStatus } from '@prisma/client'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status') || 'RUNNING'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 10
    const skip = (page - 1) * limit

    // Validate status
    const validStatuses = ['DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED', 'ARCHIVED']
    const status = (validStatuses.includes(statusParam) ? statusParam : 'RUNNING') as ABTestStatus

    const [tests, total] = await Promise.all([
      prisma.aBTest.findMany({
        where: { campaignId: id, status },
        include: {
          controlCoupon: { select: { code: true } },
          variantACoupon: { select: { code: true } },
          variantBCoupon: { select: { code: true } },
          variantCCoupon: { select: { code: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.aBTest.count({ where: { campaignId: id, status } }),
    ])

    return NextResponse.json({
      tests,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Failed to fetch A/B tests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Validate campaign exists
    const campaign = await prisma.campaign.findUnique({ where: { id } })
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Validate traffic allocation sums to 100
    const totalTraffic =
      (data.controlTraffic || 25) +
      (data.variantATraffic || 25) +
      (data.variantBTraffic || 25) +
      (data.variantCTraffic || 25)

    if (totalTraffic !== 100) {
      return NextResponse.json(
        { error: 'Traffic allocation must sum to 100%' },
        { status: 400 }
      )
    }

    const test = await prisma.aBTest.create({
      data: {
        campaignId: id,
        name: data.name,
        description: data.description,
        testingMetric: data.testingMetric,
        hypothesis: data.hypothesis,
        controlCouponId: data.controlCouponId,
        variantACouponId: data.variantACouponId,
        variantBCouponId: data.variantBCouponId,
        variantCCouponId: data.variantCCouponId,
        controlTraffic: data.controlTraffic || 25,
        variantATraffic: data.variantATraffic || 25,
        variantBTraffic: data.variantBTraffic || 25,
        variantCTraffic: data.variantCTraffic || 25,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    })

    return NextResponse.json(test, { status: 201 })
  } catch (error) {
    console.error('Failed to create A/B test:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
