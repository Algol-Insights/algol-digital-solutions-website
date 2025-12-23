import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1))
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const events = await prisma.promotionalCalendar.findMany({
      where: {
        campaignId: id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json({ events, month, year })
  } catch (error) {
    console.error('Failed to fetch calendar events:', error)
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

    const event = await prisma.promotionalCalendar.create({
      data: {
        campaignId: id,
        date: new Date(data.date),
        eventType: data.eventType,
        eventName: data.eventName,
        description: data.description,
        color: data.color || 'blue',
        reminderDays: data.reminderDays || 0,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Failed to create calendar event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
