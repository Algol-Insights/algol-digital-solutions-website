import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import {
  getRevenueByTime,
  getRevenueBySegment,
  getRevenueMetrics,
} from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const interval = (searchParams.get('interval') as 'day' | 'week' | 'month' | 'year') || 'day'
    const metric = searchParams.get('metric') || 'all'

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 },
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 },
      )
    }

    const data: Record<string, unknown> = {}

    if (metric === 'all' || metric === 'timeseries') {
      data.timeSeries = await getRevenueByTime(start, end, interval)
    }

    if (metric === 'all' || metric === 'segment') {
      data.bySegment = await getRevenueBySegment(start, end)
    }

    if (metric === 'all' || metric === 'metrics') {
      data.metrics = await getRevenueMetrics(start, end)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Revenue analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue analytics' },
      { status: 500 },
    )
  }
}
