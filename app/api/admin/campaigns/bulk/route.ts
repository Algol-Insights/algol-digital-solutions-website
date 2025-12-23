import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ids, action } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'ids must be a non-empty array' },
        { status: 400 }
      )
    }

    if (!['activate', 'pause', 'complete', 'archive', 'delete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    // Limit bulk operations to 100 items
    if (ids.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 campaigns per operation' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'activate':
        await prisma.campaign.updateMany({
          where: { id: { in: ids } },
          data: { status: 'ACTIVE' },
        })
        break

      case 'pause':
        await prisma.campaign.updateMany({
          where: { id: { in: ids } },
          data: { status: 'PAUSED' },
        })
        break

      case 'complete':
        await prisma.campaign.updateMany({
          where: { id: { in: ids } },
          data: { status: 'COMPLETED' },
        })
        break

      case 'archive':
        await prisma.campaign.updateMany({
          where: { id: { in: ids } },
          data: { status: 'ARCHIVED' },
        })
        break

      case 'delete':
        await prisma.campaign.deleteMany({
          where: { id: { in: ids } },
        })
        break
    }

    return NextResponse.json({
      success: true,
      message: `${ids.length} campaign(s) ${action}d successfully`,
    })
  } catch (error) {
    console.error('Bulk action failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
