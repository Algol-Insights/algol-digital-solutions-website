import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin, handleAdminError } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request, 'admin:security:read')

    const searchParams = new URL(request.url).searchParams
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '50')))
    const action = searchParams.get('action') || undefined
    const userId = searchParams.get('userId') || undefined
    const since = searchParams.get('since') || undefined

    const logs = await prisma.auditLog.findMany({
      where: {
        ...(action ? { action } : {}),
        ...(userId ? { userId } : {}),
        ...(since ? { createdAt: { gte: new Date(since) } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('[AUDIT] Fetch error', error)
    if ((error as any)?.status) {
      return handleAdminError(error)
    }
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
  }
}
