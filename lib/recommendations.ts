import { prisma } from '@/lib/db/prisma'

export interface RecommendationOptions {
  limit?: number
  excludeIds?: string[]
}

/**
 * Get related products based on the same category
 */
export async function getRelatedProducts(
  productId: string,
  options: RecommendationOptions = {}
) {
  const { limit = 6, excludeIds = [] } = options

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    })

    if (!product) {
      return []
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: {
          not: productId,
          notIn: excludeIds,
        },
        active: true,
        inStock: true,
      },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        originalPrice: true,
        image: true,
        rating: true,
        reviewCount: true,
        inStock: true,
      },
    })

    return relatedProducts
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

/**
 * Get products that customers also bought (based on order history)
 */
export async function getCustomersAlsoBought(
  productId: string,
  options: RecommendationOptions = {}
) {
  const { limit = 6, excludeIds = [] } = options

  try {
    // Find orders that include this product
    const ordersWithProduct = await prisma.orderItem.findMany({
      where: { productId },
      select: { orderId: true },
      distinct: ['orderId'],
    })

    const orderIds = ordersWithProduct.map(item => item.orderId)

    if (orderIds.length === 0) {
      // Fallback to related products if no purchase history
      return getRelatedProducts(productId, options)
    }

    // Find other products in those orders
    const otherProducts = await prisma.orderItem.findMany({
      where: {
        orderId: { in: orderIds },
        productId: {
          not: productId,
          notIn: excludeIds,
        },
      },
      select: {
        productId: true,
        quantity: true,
      },
    })

    // Count occurrences
    const productCounts: Map<string, number> = new Map()
    otherProducts.forEach(item => {
      const count = productCounts.get(item.productId) || 0
      productCounts.set(item.productId, count + item.quantity)
    })

    // Get top products
    const topProductIds = Array.from(productCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id)

    if (topProductIds.length === 0) {
      return getRelatedProducts(productId, options)
    }

    // Fetch product details
    const products = await prisma.product.findMany({
      where: {
        id: { in: topProductIds },
        active: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        originalPrice: true,
        image: true,
        rating: true,
        reviewCount: true,
        inStock: true,
      },
    })

    // Sort by frequency
    return products.sort((a, b) => {
      const countA = productCounts.get(a.id) || 0
      const countB = productCounts.get(b.id) || 0
      return countB - countA
    })
  } catch (error) {
    console.error('Error fetching customers also bought:', error)
    return []
  }
}

/**
 * Get recently viewed products for a user
 */
export async function getRecentlyViewedProducts(
  userId: string,
  options: RecommendationOptions = {}
) {
  const { limit = 6, excludeIds = [] } = options

  try {
    // Check if recently viewed tracking exists in user preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    })

    if (!user) {
      return []
    }

    // For now, return popular products as placeholder
    // In production, you'd store view history in a separate table
    const popularProducts = await prisma.product.findMany({
      where: {
        id: { notIn: excludeIds },
        active: true,
        inStock: true,
      },
      orderBy: [
        { reviewCount: 'desc' },
        { rating: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        originalPrice: true,
        image: true,
        rating: true,
        reviewCount: true,
        inStock: true,
      },
    })

    return popularProducts
  } catch (error) {
    console.error('Error fetching recently viewed products:', error)
    return []
  }
}

/**
 * Get personalized recommendations based on user's order history
 */
export async function getPersonalizedRecommendations(
  userId: string,
  options: RecommendationOptions = {}
) {
  const { limit = 6, excludeIds = [] } = options

  try {
    // Get user's order history
    const userOrders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              select: { categoryId: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    if (userOrders.length === 0) {
      // New user - return trending/popular products
      return getTrendingProducts(options)
    }

    // Find most common categories
    const categoryCounts: Map<string, number> = new Map()
    userOrders.forEach(order => {
      order.orderItems.forEach(item => {
        const categoryId = item.product.categoryId
        categoryCounts.set(categoryId, (categoryCounts.get(categoryId) || 0) + 1)
      })
    })

    const topCategories = Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id)

    // Get products from favorite categories that user hasn't ordered
    const orderedProductIds = new Set(
      userOrders.flatMap(order => order.orderItems.map(item => item.productId))
    )

    const recommendations = await prisma.product.findMany({
      where: {
        categoryId: { in: topCategories },
        id: {
          notIn: [...Array.from(orderedProductIds), ...excludeIds],
        },
        active: true,
        inStock: true,
      },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        originalPrice: true,
        image: true,
        rating: true,
        reviewCount: true,
        inStock: true,
      },
    })

    return recommendations
  } catch (error) {
    console.error('Error fetching personalized recommendations:', error)
    return []
  }
}

/**
 * Get trending products based on recent sales
 */
export async function getTrendingProducts(
  options: RecommendationOptions = {}
) {
  const { limit = 6, excludeIds = [] } = options

  try {
    // Get products from recent orders (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentOrderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: thirtyDaysAgo },
        },
        productId: { notIn: excludeIds },
      },
      select: {
        productId: true,
        quantity: true,
      },
    })

    // Count sales
    const salesCounts: Map<string, number> = new Map()
    recentOrderItems.forEach(item => {
      const count = salesCounts.get(item.productId) || 0
      salesCounts.set(item.productId, count + item.quantity)
    })

    const topProductIds = Array.from(salesCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id)

    if (topProductIds.length === 0) {
      // Fallback to highest rated products
      const topRated = await prisma.product.findMany({
        where: {
          id: { notIn: excludeIds },
          active: true,
          inStock: true,
        },
        orderBy: [
          { rating: 'desc' },
          { reviewCount: 'desc' },
        ],
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          originalPrice: true,
          image: true,
          rating: true,
          reviewCount: true,
          inStock: true,
        },
      })
      return topRated
    }

    const trendingProducts = await prisma.product.findMany({
      where: {
        id: { in: topProductIds },
        active: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        originalPrice: true,
        image: true,
        rating: true,
        reviewCount: true,
        inStock: true,
      },
    })

    // Sort by sales count
    return trendingProducts.sort((a, b) => {
      const countA = salesCounts.get(a.id) || 0
      const countB = salesCounts.get(b.id) || 0
      return countB - countA
    })
  } catch (error) {
    console.error('Error fetching trending products:', error)
    return []
  }
}

/**
 * Get products frequently bought together
 */
export async function getFrequentlyBoughtTogether(
  productId: string,
  options: RecommendationOptions = {}
) {
  const { limit = 3, excludeIds = [] } = options

  // Similar to customersAlsoBought but limited to 3 items for bundle display
  return getCustomersAlsoBought(productId, { limit, excludeIds })
}
