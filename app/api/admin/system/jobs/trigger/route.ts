import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { jobQueue } from '@/lib/background-jobs'

/**
 * POST /api/admin/system/jobs/trigger
 * Trigger background jobs (sales velocity, stock recommendations, auto-reorder, dead stock)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { job } = await request.json()
    if (!job || !['SALES_VELOCITY', 'STOCK_RECOMMENDATIONS', 'AUTO_REORDER', 'DEAD_STOCK_DETECTION'].includes(job)) {
      return NextResponse.json({ error: 'Invalid job type' }, { status: 400 })
    }

    const jobId = jobQueue.enqueue(job)
    return NextResponse.json({ jobId, status: 'PENDING' })
  } catch (error) {
    console.error('Error triggering job:', error)
    return NextResponse.json({ error: 'Failed to trigger job' }, { status: 500 })
  }
}

/**
 * GET /api/admin/system/jobs/trigger?id=xxx
 * Get job status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const job = jobQueue.getStatus(id)
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }
      return NextResponse.json(job)
    }

    const jobs = jobQueue.getAll()
    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error fetching job status:', error)
    return NextResponse.json({ error: 'Failed to fetch job status' }, { status: 500 })
  }
}
