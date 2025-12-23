import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { productCache } from "@/lib/cache"
import { productRateLimiter } from "@/lib/rate-limit"
import { perfMonitor } from "@/lib/performance"

// GET /api/products - Fetch all products with advanced filtering
export async function GET(request: NextRequest) {
  const started = Date.now()
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

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const rate = productRateLimiter.consume(ip)
    if (!rate.ok) {
      const retryAfter = rate.retryAfterMs ? Math.ceil(rate.retryAfterMs / 1000).toString() : "60"
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: { "Retry-After": retryAfter } }
      )
    }

    const key = buildCacheKey(searchParams)
    const cached = productCache.get(key)
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "X-Cache": "HIT",
          "X-Response-Time-ms": String(Date.now() - started),
        },
      })
    }

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

    const payload = {
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }

    productCache.set(key, payload)

    perfMonitor.log('API_REQUEST', '/api/products', Date.now() - started, {
      cached: false,
      count: products.length,
      page,
    })

    return NextResponse.json(payload, {
      headers: {
        "X-Cache": "MISS",
        "X-Response-Time-ms": String(Date.now() - started),
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

function buildCacheKey(params: URLSearchParams) {
  const entries = Array.from(params.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  return entries.map(([k, v]) => `${k}:${v}`).join("|") || "__all__"
}
