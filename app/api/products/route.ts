import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

// GET /api/products - Fetch all products with advanced filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const brands = searchParams.get("brands")?.split(",").filter(Boolean)
    const minPrice = parseFloat(searchParams.get("minPrice") || "0")
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999")
    const minRating = parseFloat(searchParams.get("minRating") || "0")
    const inStockOnly = searchParams.get("inStock") === "true"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "newest"

    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {
      active: true,
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      rating: {
        gte: minRating,
      },
    }

    if (category) {
      where.category = {
        slug: category.toLowerCase(),
      }
    }

    if (brands && brands.length > 0) {
      where.brand = {
        in: brands,
      }
    }

    if (inStockOnly) {
      where.inStock = true
      where.stock = {
        gt: 0,
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ]
    }

    // Determine sort order
    let orderBy: any = { createdAt: "desc" }
    switch (sortBy) {
      case "price-asc":
        orderBy = { price: "asc" }
        break
      case "price-desc":
        orderBy = { price: "desc" }
        break
      case "rating":
        orderBy = { rating: "desc" }
        break
      case "popular":
        orderBy = { reviewCount: "desc" }
        break
      case "newest":
        orderBy = { createdAt: "desc" }
        break
    }

    // Fetch products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
