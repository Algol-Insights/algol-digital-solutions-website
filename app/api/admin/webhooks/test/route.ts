import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, handleAdminError } from '@/lib/admin-auth'
import { deliverEvent } from '@/lib/webhooks'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request, 'admin:security:write')
    const body = await request.json()
    const type = body.type || 'test.webhook'
    const data = body.data || { message: 'Hello from Algol', ts: Date.now() }

    const result = await deliverEvent(type, data)
    return NextResponse.json(result)
  } catch (error) {
    if ((error as any)?.status) return handleAdminError(error)
    return NextResponse.json({ error: 'Failed to send test webhook' }, { status: 500 })
  }
}
