import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireAdmin, handleAdminError } from '@/lib/admin-auth'
import { logAuditEvent } from '@/lib/audit'

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request, 'admin:products:write')
    const { id } = await params
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
      featured,
      active,
    } = body

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Track inventory change if stock is being updated
    const stockChange = stock !== undefined ? parseInt(stock) - existingProduct.stock : 0

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(name && { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }),
        ...(description !== undefined && { description }),
        ...(categoryId && { categoryId }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice ? parseFloat(originalPrice) : null }),
        ...(sku && { sku }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(image && { image }),
        ...(specs !== undefined && { specs }),
        ...(featured !== undefined && { featured }),
        ...(active !== undefined && { active }),
      },
      include: { category: true },
    })

    // Log inventory change if stock was updated
    if (stockChange !== 0) {
      await prisma.inventoryLog.create({
        data: {
          productId: id,
          previousStock: existingProduct.stock,
          newStock: parseInt(stock),
          change: stockChange,
          reason: "STOCK_UPDATE",
        },
      })
    }
    await logAuditEvent({
      userId: admin.userId,
      action: 'PRODUCT_UPDATE',
      targetType: 'PRODUCT',
      targetId: id,
      status: 'SUCCESS',
      ip: admin.ip,
      userAgent: admin.userAgent,
      metadata: { stockChange },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    await logAuditEvent({
      action: 'PRODUCT_UPDATE',
      targetType: 'PRODUCT',
      status: 'FAIL',
      metadata: { message: error instanceof Error ? error.message : 'Unknown error' },
    })
    if ((error as any)?.status) {
      return handleAdminError(error)
    }
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request, 'admin:products:write')
    const { id } = await params

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Delete product (cascade will handle related records)
    await prisma.product.delete({
      where: { id },
    })
    await logAuditEvent({
      userId: admin.userId,
      action: 'PRODUCT_DELETE',
      targetType: 'PRODUCT',
      targetId: id,
      status: 'SUCCESS',
      ip: admin.ip,
      userAgent: admin.userAgent,
    })

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting product:", error)
    await logAuditEvent({
      action: 'PRODUCT_DELETE',
      targetType: 'PRODUCT',
      status: 'FAIL',
      metadata: { message: error instanceof Error ? error.message : 'Unknown error' },
    })
    if ((error as any)?.status) {
      return handleAdminError(error)
    }
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
