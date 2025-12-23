import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; eventId: string }> }) {
  try {
    const { id, eventId } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const event = await prisma.promotionalCalendar.update({
      where: { id: eventId },
      data: {
        eventName: data.eventName,
        description: data.description,
        date: data.date ? new Date(data.date) : undefined,
        color: data.color,
        reminderDays: data.reminderDays,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Failed to update calendar event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; eventId: string }> }) {
  try {
    const { id, eventId } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.promotionalCalendar.delete({ where: { id: eventId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete calendar event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
