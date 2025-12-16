import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category") || ""
    const brand = searchParams.get("brand") || ""
    const minPrice = parseFloat(searchParams.get("minPrice") || "0")
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999")
    const sortBy = searchParams.get("sortBy") || "relevance"

    // Build where clause for search
    const whereClause: any = {
      AND: [
        // Price filter
        {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      ],
    }

    // Add search query filter (full-text search simulation)
    if (query.trim()) {
      whereClause.AND.push({
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      })
    }

    // Add category filter
    if (category) {
      whereClause.AND.push({
        category: {
          name: { equals: category, mode: "insensitive" },
        },
      })
    }

    // Add brand filter
    if (brand) {
      whereClause.AND.push({
        brand: { equals: brand, mode: "insensitive" },
      })
    }

    // Build orderBy clause
    let orderBy: any = {}
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
      case "relevance":
      default:
        // For relevance, we'll order by a combination of factors
        // In a real app, you'd use PostgreSQL full-text search or Algolia
        orderBy = [{ rating: "desc" }, { reviewCount: "desc" }]
        break
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch products with search
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      query: query.trim(),
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search products",
      },
      { status: 500 }
    )
  }
}
