import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// GET /api/services/[id] - Get single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const service = await prisma.service.findUnique({
      where: { id },
    })

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      service,
    })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

// PUT /api/services/[id] - Update service (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const service = await prisma.service.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        longDescription: body.longDescription,
        icon: body.icon,
        image: body.image,
        price: body.price ? parseFloat(body.price) : undefined,
        pricingType: body.pricingType,
        duration: body.duration,
        featured: body.featured,
        active: body.active,
        features: body.features,
        category: body.category,
        sortOrder: body.sortOrder,
      },
    })

    return NextResponse.json({
      success: true,
      service,
    })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE /api/services/[id] - Delete service (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.service.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
