import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCustomersWithSegmentation, CustomerSegment } from '@/lib/customer-segmentation'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role?.toString().toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const segment = searchParams.get('segment') as CustomerSegment | null
    const search = searchParams.get('search')
    const minLifetimeValue = searchParams.get('minLifetimeValue')
    const maxLifetimeValue = searchParams.get('maxLifetimeValue')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const filters: any = {}
    if (segment) filters.segment = segment
    if (search) filters.search = search
    if (minLifetimeValue) filters.minLifetimeValue = parseInt(minLifetimeValue)
    if (maxLifetimeValue) filters.maxLifetimeValue = parseInt(maxLifetimeValue)
    if (startDate) filters.startDate = new Date(startDate)
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      filters.endDate = end
    }

    const { customers } = await getCustomersWithSegmentation(filters, { page: 1, limit: 10000 })

    const header = ['ID', 'Name', 'Email', 'Segment', 'Total Orders', 'Lifetime Value (USD)', 'Avg Order Value (USD)', 'Joined']
    const lines = customers.map((c) => [
      c.id,
      c.name,
      c.email,
      c.segment,
      c.totalOrders.toString(),
      (c.lifetimeValue / 100).toFixed(2),
      (c.averageOrderValue / 100).toFixed(2),
      new Date(c.createdAt).toISOString(),
    ])

    const csv = [header, ...lines]
      .map((row) => row.map((value) => `"${(value ?? '').toString().replace(/"/g, '""')}"`).join(','))
      .join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="customers.csv"',
      },
    })
  } catch (error) {
    console.error('Export customers error:', error)
    return NextResponse.json({ error: 'Failed to export customers' }, { status: 500 })
  }
}
