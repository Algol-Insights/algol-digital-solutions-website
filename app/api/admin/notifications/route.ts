import { NextRequest, NextResponse } from 'next/server'
import { addNotification, listNotifications, markRead } from '@/lib/notifications'
import { requireAdmin, handleAdminError } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request, 'admin:access')
    const notifications = listNotifications()
    return NextResponse.json({ notifications })
  } catch (error) {
    if ((error as any)?.status) return handleAdminError(error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request, 'admin:security:write')
    const body = await request.json()
    const created = addNotification({
      type: body.type || 'generic',
      message: body.message || 'Notification',
      severity: body.severity || 'info',
      data: body.data,
      read: false,
    })
    return NextResponse.json({ notification: created, by: admin.userId })
  } catch (error) {
    if ((error as any)?.status) return handleAdminError(error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin(request, 'admin:access')
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    markRead(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as any)?.status) return handleAdminError(error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}
