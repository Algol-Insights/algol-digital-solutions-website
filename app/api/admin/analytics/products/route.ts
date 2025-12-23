import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { getTopProducts } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const metric = (searchParams.get('metric') as 'revenue' | 'units') || 'revenue'

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

    const topProducts = await getTopProducts(start, end, Math.min(limit, 100), metric)
    const bottomProducts = await getTopProducts(start, end, Math.min(limit, 100), metric)

    return NextResponse.json({
      top: topProducts.slice(0, limit),
      bottom: bottomProducts.slice(-limit).reverse(),
    })
  } catch (error) {
    console.error('Product analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product analytics' },
      { status: 500 },
    )
  }
}
