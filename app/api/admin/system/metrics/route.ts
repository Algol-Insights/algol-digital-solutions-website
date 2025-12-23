import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { perfMonitor } from '@/lib/performance'

/**
 * GET /api/admin/system/metrics
 * Get performance metrics and stats
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path') || undefined
    const type = searchParams.get('type') as any
    const since = searchParams.get('since') ? parseInt(searchParams.get('since')!) : undefined

    const metrics = perfMonitor.getMetrics({ type, path, since })
    const stats = perfMonitor.getStats(path)

    return NextResponse.json({ metrics, stats })
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/system/metrics
 * Clear metrics
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    perfMonitor.clear()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing metrics:', error)
    return NextResponse.json({ error: 'Failed to clear metrics' }, { status: 500 })
  }
}
