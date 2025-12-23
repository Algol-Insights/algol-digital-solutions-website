import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { calculateCLV } from '@/lib/analytics'

/**
 * GET /api/admin/analytics/clv
 * Get Customer Lifetime Value analysis
 * Returns: CLV scores sorted by predicted lifetime value
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  // Check admin authorization
  if (!session || (session.user as any)?.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500)
    const segment = searchParams.get('segment') || 'all' // 'high', 'medium', 'low', 'all'

    const clvData = await calculateCLV()

    // Filter by segment if requested
    let filtered = clvData
    if (segment !== 'all') {
      filtered = clvData.filter((c) => c.valueSegment === segment)
    }

    // Calculate summary statistics
    const highValue = clvData.filter((c) => c.valueSegment === 'high').length
    const mediumValue = clvData.filter((c) => c.valueSegment === 'medium').length
    const lowValue = clvData.filter((c) => c.valueSegment === 'low').length

    return Response.json({
      data: filtered.slice(0, limit),
      summary: {
        totalCustomers: clvData.length,
        highValue,
        mediumValue,
        lowValue,
        totalLTV: clvData.reduce((sum, c) => sum + c.ltv, 0),
        averageLTV: clvData.length > 0 ? clvData.reduce((sum, c) => sum + c.ltv, 0) / clvData.length : 0,
        totalCurrentValue: clvData.reduce((sum, c) => sum + c.currentValue, 0),
      },
      count: filtered.length,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('CLV calculation error:', error)
    return Response.json(
      { error: 'Failed to calculate CLV' },
      { status: 500 }
    )
  }
}
