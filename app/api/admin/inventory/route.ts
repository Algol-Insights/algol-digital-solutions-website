import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getLowStockProducts,
  getOutOfStockProducts,
  getInventorySummary,
} from '@/lib/inventory'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'summary'
    const threshold = parseInt(searchParams.get('threshold') || '10')

    let data

    switch (type) {
      case 'low-stock':
        data = await getLowStockProducts(threshold)
        break
      case 'out-of-stock':
        data = await getOutOfStockProducts()
        break
      case 'summary':
      default:
        data = await getInventorySummary()
        break
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Inventory API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory data' },
      { status: 500 }
    )
  }
}
