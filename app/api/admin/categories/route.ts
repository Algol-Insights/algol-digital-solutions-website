import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireAdmin, handleAdminError } from '@/lib/admin-auth'
import { logAuditEvent } from '@/lib/audit'

// GET /api/admin/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request, 'admin:categories:read')

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    await logAuditEvent({
      userId: admin.userId,
      action: 'CATEGORY_LIST',
      targetType: 'CATEGORY',
      status: 'SUCCESS',
      ip: admin.ip,
      userAgent: admin.userAgent,
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    await logAuditEvent({
      action: 'CATEGORY_LIST',
      targetType: 'CATEGORY',
      status: 'FAIL',
      metadata: { message: error instanceof Error ? error.message : 'Unknown error' },
    })
    if ((error as any)?.status) {
      return handleAdminError(error)
    }
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request, 'admin:categories:write')
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    })

    await logAuditEvent({
      userId: admin.userId,
      action: 'CATEGORY_CREATE',
      targetType: 'CATEGORY',
      targetId: category.id,
      status: 'SUCCESS',
      ip: admin.ip,
      userAgent: admin.userAgent,
      metadata: { name },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    await logAuditEvent({
      action: 'CATEGORY_CREATE',
      targetType: 'CATEGORY',
      status: 'FAIL',
      metadata: { message: error instanceof Error ? error.message : 'Unknown error' },
    })
    if ((error as any)?.status) {
      return handleAdminError(error)
    }
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}
