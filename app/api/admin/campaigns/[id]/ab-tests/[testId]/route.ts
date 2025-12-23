import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; testId: string }> }) {
  try {
    const { id, testId } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const test = await prisma.aBTest.findUnique({
      where: { id: testId },
      include: {
        controlCoupon: true,
        variantACoupon: true,
        variantBCoupon: true,
        variantCCoupon: true,
      },
    })

    if (!test || test.campaignId !== id) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Calculate statistics
    const stats = calculateStats(test)

    return NextResponse.json({ ...test, stats })
  } catch (error) {
    console.error('Failed to fetch A/B test:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; testId: string }> }) {
  try {
    const { id, testId } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const test = await prisma.aBTest.update({
      where: { id: testId },
      data: {
        status: data.status,
        winnerVariant: data.winnerVariant,
      },
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error('Failed to update A/B test:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; testId: string }> }) {
  try {
    const { id, testId } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.aBTest.delete({ where: { id: testId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete A/B test:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateStats(test: any) {
  return {
    control: {
      opens: test.controlOpens,
      clicks: test.controlClicks,
      conversions: test.controlConversions,
      openRate: test.controlOpens > 0 ? ((test.controlClicks / test.controlOpens) * 100).toFixed(2) : 0,
      clickRate: test.controlClicks > 0 ? ((test.controlConversions / test.controlClicks) * 100).toFixed(2) : 0,
    },
    variantA: {
      opens: test.variantAOpens,
      clicks: test.variantAClicks,
      conversions: test.variantAConversions,
      openRate: test.variantAOpens > 0 ? ((test.variantAClicks / test.variantAOpens) * 100).toFixed(2) : 0,
      clickRate: test.variantAClicks > 0 ? ((test.variantAConversions / test.variantAClicks) * 100).toFixed(2) : 0,
    },
    variantB: {
      opens: test.variantBOpens,
      clicks: test.variantBClicks,
      conversions: test.variantBConversions,
      openRate: test.variantBOpens > 0 ? ((test.variantBClicks / test.variantBOpens) * 100).toFixed(2) : 0,
      clickRate: test.variantBClicks > 0 ? ((test.variantBConversions / test.variantBClicks) * 100).toFixed(2) : 0,
    },
    variantC: {
      opens: test.variantCOpens,
      clicks: test.variantCClicks,
      conversions: test.variantCConversions,
      openRate: test.variantCOpens > 0 ? ((test.variantCClicks / test.variantCOpens) * 100).toFixed(2) : 0,
      clickRate: test.variantCClicks > 0 ? ((test.variantCConversions / test.variantCClicks) * 100).toFixed(2) : 0,
    },
  }
}
