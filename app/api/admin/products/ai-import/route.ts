import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'

interface ProductData {
  name: string
  description: string
  price: number
  stock: number
  brand: string
  category: string
  specs?: Record<string, any>
  imageUrl?: string
}

export async function POST(req: NextRequest) {
  try {
    // TODO: Add authentication
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { products } = await req.json()

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'Products array is required' },
        { status: 400 }
      )
    }

    // Import products to database
    const imported: any[] = []
    const errors: any[] = []

    for (const product of products) {
      try {
        // Prepare specs string
        const specsString = product.specs 
          ? Object.entries(product.specs)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')
          : ''

        // Generate slug and SKU
        const slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
        const sku = `AI-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

        // Create product
        const created = await prisma.product.create({
          data: {
            name: product.name,
            slug,
            sku,
            description: product.description,
            price: product.price,
            stock: product.stock,
            brand: product.brand,
            category: product.category,
            specs: specsString,
            images: product.imageUrl ? [product.imageUrl] : [],
            inStock: product.stock > 0,
            featured: false,
          },
        })

        // Create inventory log for initial stock
        await prisma.inventoryLog.create({
          data: {
            productId: created.id,
            previousStock: 0,
            newStock: product.stock,
            change: product.stock,
            reason: 'AI Import - Initial stock',
          },
        })

        imported.push({ 
          name: product.name, 
          id: created.id 
        })
      } catch (error) {
        console.error(`Failed to import ${product.name}:`, error)
        errors.push({ 
          name: product.name, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      failed: errors.length,
      products: imported,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Product import error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to import products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
