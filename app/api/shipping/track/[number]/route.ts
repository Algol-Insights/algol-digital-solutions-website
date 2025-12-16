import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { getTrackingInfo } from '@/lib/shipping'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    const { number: trackingNumber } = await params

    // Get tracking info from carrier API
    const trackingInfo = await getTrackingInfo(trackingNumber)

    return Response.json(trackingInfo)
  } catch (error: any) {
    console.error('Tracking error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to get tracking info' }),
      { status: 500 }
    )
  }
}
