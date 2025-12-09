import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      categoryId,
      price,
      originalPrice,
      sku,
      stock,
      image,
      specs,
      featured = false,
      active = true,
    } = body

    // Validate required fields
    if (!name || !categoryId || price === undefined || stock === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, categoryId, price, stock" },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        sku: sku || `SKU-${Date.now()}`,
        stock: parseInt(stock),
        image,
        specs: specs || {},
        featured,
        active,
      },
      include: { category: true },
    })

    // Log the inventory change
    await prisma.inventoryLog.create({
      data: {
        productId: product.id,
        previousStock: 0,
        newStock: parseInt(stock),
        change: parseInt(stock),
        reason: "INITIAL_STOCK",
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
