import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin, handleAdminError } from '@/lib/admin-auth'
import { randomBytes } from 'crypto'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request, 'admin:security:read')
    const endpoints = await prisma.webhookEndpoint.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ endpoints })
  } catch (error) {
    if ((error as any)?.status) return handleAdminError(error)
    return NextResponse.json({ error: 'Failed to list webhooks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request, 'admin:security:write')
    const body = await request.json()
    const { url, events, description, headers } = body

    if (!url || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'url and at least one event are required' }, { status: 400 })
    }

    const endpoint = await prisma.webhookEndpoint.create({
      data: {
        url,
        events,
        description: description || null,
        headers: headers || undefined,
        secret: randomBytes(32).toString('hex'),
      },
    })

    return NextResponse.json({ endpoint })
  } catch (error) {
    if ((error as any)?.status) return handleAdminError(error)
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request, 'admin:security:write')
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    await prisma.webhookEndpoint.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as any)?.status) return handleAdminError(error)
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 })
  }
}
