import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

// Helper function to convert data to CSV
function generateCSV(orders: any[]) {
  if (orders.length === 0) {
    return 'No orders found'
  }

  // Define CSV headers
  const headers = [
    'Order Number',
    'Customer Name',
    'Customer Email',
    'Status',
    'Payment Status',
    'Subtotal',
    'Tax',
    'Shipping',
    'Total',
    'Items Count',
    'Order Date',
    'Estimated Delivery',
    'Delivered Date',
  ]

  // Convert orders to CSV rows
  const rows = orders.map((order) => [
    order.orderNumber,
    order.customer?.name || 'N/A',
    order.customer?.email || 'N/A',
    order.status,
    order.paymentStatus,
    (order.subtotal / 100).toFixed(2),
    (order.tax / 100).toFixed(2),
    (order.shipping / 100).toFixed(2),
    (order.total / 100).toFixed(2),
    order.orderItems?.length || 0,
    new Date(order.createdAt).toLocaleDateString(),
    order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'N/A',
    order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'N/A',
  ])

  // Combine headers and rows
  const csvContent = [
    headers.map((h) => `"${h}"`).join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  return csvContent
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
    })

    if (!user || user.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const format = searchParams.get('format') || 'csv'

    // Build filter conditions
    const where: any = {}

    if (status !== 'all') {
      where.status = status.toUpperCase()
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        where.createdAt.lte = end
      }
    }

    // Fetch orders with details
    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (format === 'csv') {
      // Generate CSV content
      const csvContent = generateCSV(orders)

      // Return as downloadable file
      const filename = `orders_${new Date().toISOString().split('T')[0]}.csv`

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    } else if (format === 'json') {
      // Return as JSON
      return NextResponse.json({
        count: orders.length,
        data: orders,
        exportedAt: new Date().toISOString(),
      })
    } else {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export orders' },
      { status: 500 }
    )
  }
}
