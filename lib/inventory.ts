import { prisma } from '@/lib/db/prisma'
import { DEFAULT_LOW_STOCK_THRESHOLD } from '@/lib/inventory-config'

export interface InventoryUpdate {
  productId: string
  variantId?: string
  quantity: number
  type: 'ADJUSTMENT' | 'SALE' | 'RETURN' | 'RESTOCK' | 'DAMAGE' | 'CORRECTION'
  reason?: string
  userId: string
}

/**
 * Update product inventory and create log entry
 */
export async function updateInventory(update: InventoryUpdate) {
  try {
    const { productId, variantId, quantity, type, reason, userId } = update

    // Update product or variant stock
    if (variantId) {
      await prisma.productVariant.update({
        where: { id: variantId },
        data: {
          stock: {
            increment: quantity,
          },
          inStock: true, // Will be updated in next step if needed
        },
      })

      // Check if stock is now 0 or negative
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
      })

      if (variant && variant.stock <= 0) {
        await prisma.productVariant.update({
          where: { id: variantId },
          data: { inStock: false, stock: 0 },
        })
      }
    } else {
      await prisma.product.update({
        where: { id: productId },
        data: {
          stock: {
            increment: quantity,
          },
          inStock: true,
        },
      })

      // Check if stock is now 0 or negative
      const product = await prisma.product.findUnique({
        where: { id: productId },
      })

      if (product && product.stock <= 0) {
        await prisma.product.update({
          where: { id: productId },
          data: { inStock: false, stock: 0 },
        })
      }
    }

    // Create inventory log
    const newStock = variantId
      ? (await prisma.productVariant.findUnique({ where: { id: variantId } }))?.stock || 0
      : (await prisma.product.findUnique({ where: { id: productId } }))?.stock || 0

    await prisma.inventoryLog.create({
      data: {
        productId,
        change: quantity,
        reason: reason || type || 'Inventory update',
        previousStock: newStock - quantity,
        newStock,
      },
    })

    return { success: true, newStock }
  } catch (error) {
    console.error('Error updating inventory:', error)
    throw error
  }
}

/**
 * Get low stock products
 */
export async function getLowStockProducts(threshold: number = 10) {
  try {
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: threshold,
          gt: 0,
        },
        active: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        stock: 'asc',
      },
    })

    const lowStockVariants = await prisma.productVariant.findMany({
      where: {
        stock: {
          lte: threshold,
          gt: 0,
        },
        active: true,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        stock: 'asc',
      },
    })

    return {
      products: lowStockProducts,
      variants: lowStockVariants,
    }
  } catch (error) {
    console.error('Error fetching low stock products:', error)
    return { products: [], variants: [] }
  }
}

/**
 * Get out of stock products
 */
export async function getOutOfStockProducts() {
  try {
    const outOfStockProducts = await prisma.product.findMany({
      where: {
        stock: 0,
        active: true,
      },
      include: {
        category: true,
        stockAlerts: {
          where: {
            notified: false,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const outOfStockVariants = await prisma.productVariant.findMany({
      where: {
        stock: 0,
        active: true,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
        stockAlerts: {
          where: {
            notified: false,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return {
      products: outOfStockProducts,
      variants: outOfStockVariants,
    }
  } catch (error) {
    console.error('Error fetching out of stock products:', error)
    return { products: [], variants: [] }
  }
}

/**
 * Get inventory history for a product
 */
export async function getInventoryHistory(
  productId: string,
  variantId?: string,
  limit: number = 50
) {
  try {
    const logs = await prisma.inventoryLog.findMany({
      where: {
        productId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return logs
  } catch (error) {
    console.error('Error fetching inventory history:', error)
    return []
  }
}

/**
 * Bulk update inventory
 */
export async function bulkUpdateInventory(
  updates: Array<{
    productId: string
    variantId?: string
    quantity: number
  }>,
  type: 'ADJUSTMENT' | 'RESTOCK',
  reason: string,
  userId: string
) {
  try {
    const results = []

    for (const update of updates) {
      try {
        const result = await updateInventory({
          ...update,
          type,
          reason,
          userId,
        })
        results.push({ ...update, ...result })
      } catch (error) {
        results.push({ ...update, success: false, error: String(error) })
      }
    }

    return results
  } catch (error) {
    console.error('Error bulk updating inventory:', error)
    throw error
  }
}

/**
 * Get inventory summary statistics
 */
export async function getInventorySummary(threshold: number = DEFAULT_LOW_STOCK_THRESHOLD) {
  try {
    const safeThreshold = Number.isFinite(threshold) && threshold >= 0 ? threshold : DEFAULT_LOW_STOCK_THRESHOLD
    const [totalProducts, lowStockCount, outOfStockCount, totalValue] =
      await Promise.all([
        prisma.product.count({
          where: { active: true },
        }),
        prisma.product.count({
          where: {
            active: true,
            stock: {
              lte: safeThreshold,
              gt: 0,
            },
          },
        }),
        prisma.product.count({
          where: {
            active: true,
            stock: 0,
          },
        }),
        prisma.product.aggregate({
          where: { active: true },
          _sum: {
            stock: true,
          },
        }),
      ])

    // Calculate total inventory value
    const products = await prisma.product.findMany({
      where: { active: true },
      select: {
        stock: true,
        price: true,
      },
    })

    const inventoryValue = products.reduce(
      (sum, product) => sum + product.stock * product.price,
      0
    )

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalStock: totalValue._sum.stock || 0,
      inventoryValue,
    }
  } catch (error) {
    console.error('Error fetching inventory summary:', error)
    return {
      totalProducts: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      totalStock: 0,
      inventoryValue: 0,
    }
  }
}
