import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { predictChurn } from '@/lib/analytics'

/**
 * GET /api/admin/analytics/churn
 * Predict customer churn risk
 * Returns: List of at-risk customers with churn probability and risk factors
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  // Check admin authorization
  if (!session || (session.user as any)?.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const daysThreshold = parseInt(searchParams.get('daysThreshold') || '90')
    const riskLevel = searchParams.get('riskLevel') || 'all' // 'high', 'medium', 'low', 'all'
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500)

    // Validate threshold
    if (daysThreshold < 7 || daysThreshold > 365) {
      return Response.json(
        { error: 'daysThreshold must be between 7 and 365' },
        { status: 400 }
      )
    }

    const churnPredictions = await predictChurn(daysThreshold)

    // Filter by risk level if requested
    let filtered = churnPredictions
    if (riskLevel !== 'all') {
      filtered = churnPredictions.filter((c) => c.churnRisk === riskLevel)
    }

    // Calculate summary statistics
    const highRisk = churnPredictions.filter((c) => c.churnRisk === 'high').length
    const mediumRisk = churnPredictions.filter((c) => c.churnRisk === 'medium').length
    const lowRisk = churnPredictions.filter((c) => c.churnRisk === 'low').length

    return Response.json({
      predictions: filtered.slice(0, limit),
      summary: {
        totalAtRisk: churnPredictions.length,
        highRisk,
        mediumRisk,
        lowRisk,
        averageChurnProbability: churnPredictions.length > 0
          ? churnPredictions.reduce((sum, c) => sum + c.churnProbability, 0) / churnPredictions.length
          : 0,
      },
      count: filtered.length,
      daysThreshold,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('Churn prediction error:', error)
    return Response.json(
      { error: 'Failed to predict churn' },
      { status: 500 }
    )
  }
}
