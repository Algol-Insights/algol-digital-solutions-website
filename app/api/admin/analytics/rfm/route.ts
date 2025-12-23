import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { calculateRFMScores, getRFMSegmentSummary } from '@/lib/analytics'

/**
 * GET /api/admin/analytics/rfm
 * Get RFM analysis and customer segmentation
 * Returns: RFM scores for all customers and segment summary
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  // Check admin authorization
  if (!session || (session.user as any)?.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const view = searchParams.get('view') || 'summary' // 'summary' or 'detailed'

    if (view === 'detailed') {
      // Return detailed RFM scores for all customers
      const rfmScores = await calculateRFMScores()
      return Response.json({
        scores: rfmScores,
        count: rfmScores.length,
        timestamp: new Date(),
      })
    }

    // Default: return segment summary
    const segmentSummary = await getRFMSegmentSummary()

    return Response.json({
      segments: segmentSummary,
      totalCustomers: segmentSummary.reduce((sum, s) => sum + s.count, 0),
      totalRevenue: segmentSummary.reduce((sum, s) => sum + s.revenue, 0),
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('RFM analysis error:', error)
    return Response.json(
      { error: 'Failed to generate RFM analysis' },
      { status: 500 }
    )
  }
}
