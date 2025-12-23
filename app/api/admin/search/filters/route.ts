import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin, handleAdminError } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request, 'admin:access')
    const { searchParams } = new URL(request.url)
    const resource = searchParams.get('resource') || undefined

    const filters = await prisma.savedFilter.findMany({
      where: {
        userId: admin.userId,
        ...(resource ? { resource } : {}),
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ filters })
  } catch (error) {
    if ((error as any)?.status) return handleAdminError(error)
    return NextResponse.json({ error: 'Failed to fetch saved filters' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request, 'admin:access')
    const body = await request.json()
    const { name, resource, query, isDefault } = body

    if (!name || !resource || !query) {
      return NextResponse.json({ error: 'name, resource, and query are required' }, { status: 400 })
    }

    let parsed: any = query
    if (typeof query === 'string') {
      try {
        parsed = JSON.parse(query)
      } catch {
        return NextResponse.json({ error: 'query must be valid JSON' }, { status: 400 })
      }
    }

    if (isDefault) {
      await prisma.savedFilter.updateMany({
        where: { userId: admin.userId, resource },
        data: { isDefault: false },
      })
    }

    const filter = await prisma.savedFilter.create({
      data: {
        userId: admin.userId!,
        name,
        resource,
        query: parsed,
        isDefault: Boolean(isDefault),
      },
    })

    return NextResponse.json({ filter })
  } catch (error) {
    if ((error as any)?.status) return handleAdminError(error)
    return NextResponse.json({ error: 'Failed to save filter' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin(request, 'admin:access')
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    await prisma.savedFilter.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as any)?.status) return handleAdminError(error)
    return NextResponse.json({ error: 'Failed to delete filter' }, { status: 500 })
  }
}
