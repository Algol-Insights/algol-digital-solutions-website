import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { generateCohorts } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const interval = (searchParams.get('interval') as 'week' | 'month' | 'year') || 'month'

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

    const cohorts = await generateCohorts(start, end, interval as any)

    return NextResponse.json({ cohorts })
  } catch (error) {
    console.error('Cohort analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cohort analytics' },
      { status: 500 },
    )
  }
}
