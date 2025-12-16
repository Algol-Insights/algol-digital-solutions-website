import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Verify ticket exists and user has access
    const { id } = await params
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    if (ticket.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const isStaff = user.role === 'admin'

    // Create message
    const ticketMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        userId: user.id,
        message,
        isStaff,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    })

    // Update ticket status if customer replies to resolved/closed ticket
    if (!isStaff && (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED')) {
      await prisma.supportTicket.update({
        where: { id },
        data: { status: 'OPEN' },
      })
    } else if (isStaff && ticket.status === 'OPEN') {
      // Update to IN_PROGRESS when staff first replies
      await prisma.supportTicket.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
      })
    }

    return NextResponse.json({ message: ticketMessage })
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
