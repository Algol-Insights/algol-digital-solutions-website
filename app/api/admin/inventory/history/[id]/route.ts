import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getInventoryHistory } from '@/lib/inventory'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const variantId = searchParams.get('variantId') || undefined
    const limit = parseInt(searchParams.get('limit') || '50')

    const history = await getInventoryHistory(id, variantId, limit)

    return NextResponse.json({ history })
  } catch (error) {
    console.error('Inventory history API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory history' },
      { status: 500 }
    )
  }
}
