import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { getCustomerInsights } from '@/lib/customer-segmentation'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role?.toString().toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const customerId = id

    // Get customer with full details
    const insights = await getCustomerInsights(customerId)

    if (!insights) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json(insights)
  } catch (error) {
    console.error('Get customer detail error:', error)
    return NextResponse.json({ error: 'Failed to fetch customer details' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role?.toString().toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const customerId = id
    const body = await request.json()

    // Update customer
    const updated = await prisma.customer.update({
      where: { id: customerId },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update customer error:', error)
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role?.toString().toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const customerId = id

    // Only allow deletion if customer has no orders
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: { orders: { take: 1 } },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    if (customer.orders.length > 0) {
      return NextResponse.json({ error: 'Cannot delete customer with existing orders' }, { status: 400 })
    }

    await prisma.customer.delete({
      where: { id: customerId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete customer error:', error)
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}
