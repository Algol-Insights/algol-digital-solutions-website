import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// GET /api/services - Get all services with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const active = searchParams.get('active')

    const where: any = {}

    if (featured === 'true') {
      where.featured = true
    }

    if (category) {
      where.category = category
    }

    if (active !== 'false') {
      where.active = true
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({
      success: true,
      services,
      count: services.length,
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST /api/services - Create new service (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const service = await prisma.service.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        longDescription: body.longDescription,
        icon: body.icon,
        image: body.image,
        price: parseFloat(body.price),
        pricingType: body.pricingType || 'from',
        duration: body.duration,
        featured: body.featured || false,
        active: body.active !== false,
        features: body.features || [],
        category: body.category,
        sortOrder: body.sortOrder || 0,
      },
    })

    return NextResponse.json({
      success: true,
      service,
    })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
