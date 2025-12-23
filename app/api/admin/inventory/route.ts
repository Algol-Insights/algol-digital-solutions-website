import { NextRequest, NextResponse } from 'next/server'
import {
  getLowStockProducts,
  getOutOfStockProducts,
  getInventorySummary,
} from '@/lib/inventory'
import { requireAdmin, handleAdminError } from '@/lib/admin-auth'
import { logAuditEvent } from '@/lib/audit'

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request, 'admin:inventory:read')

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

    await logAuditEvent({
      userId: admin.userId,
      action: 'INVENTORY_VIEW',
      targetType: 'INVENTORY',
      status: 'SUCCESS',
      ip: admin.ip,
      userAgent: admin.userAgent,
      metadata: { type },
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Inventory API error:', error)
    await logAuditEvent({
      action: 'INVENTORY_VIEW',
      targetType: 'INVENTORY',
      status: 'FAIL',
      metadata: { message: error instanceof Error ? error.message : 'Unknown error' },
    })
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((error as any)?.status) {
      return handleAdminError(error)
    }
    return NextResponse.json(
      { error: 'Failed to fetch inventory data' },
      { status: 500 }
    )
  }
}
