import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { generateSku } from "@/lib/sku"
import { requireAdmin, handleAdminError } from '@/lib/admin-auth'
import { logAuditEvent } from '@/lib/audit'

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request, 'admin:products:write')
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
        sku: sku || await generateSku(name, slug),
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
    await logAuditEvent({
      userId: admin.userId,
      action: 'PRODUCT_CREATE',
      targetType: 'PRODUCT',
      targetId: product.id,
      status: 'SUCCESS',
      ip: admin.ip,
      userAgent: admin.userAgent,
      metadata: { name: product.name, categoryId: product.categoryId },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    await logAuditEvent({
      action: 'PRODUCT_CREATE',
      targetType: 'PRODUCT',
      status: 'FAIL',
      metadata: { message: error instanceof Error ? error.message : 'Unknown error' },
    })
    if ((error as any)?.status) {
      return handleAdminError(error)
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
