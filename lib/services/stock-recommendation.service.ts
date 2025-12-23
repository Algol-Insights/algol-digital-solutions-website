import { prisma } from '@/lib/db/prisma';
import {
  calculateStockLevels,
  calculateEOQ,
  INVENTORY_AUTOMATION,
} from '@/lib/inventory-automation-config';
import { SalesVelocityService } from './sales-velocity.service';

/**
 * Service for generating stock level recommendations
 * Uses formulas to calculate optimal min/max/safety stock levels
 */
export class StockRecommendationService {
  /**
   * Generate recommendation for a single product
   */
  static async generateRecommendation(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { salesVelocity: true },
    });

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    // Get or calculate sales velocity
    let velocity = product.salesVelocity;
    if (!velocity) {
      await SalesVelocityService.updateVelocity(productId);
      velocity = await prisma.salesVelocity.findUnique({
        where: { productId },
      });
    }

    if (!velocity || velocity.dailyVelocity === 0) {
      // No sales history - use conservative defaults
      return this.createDefaultRecommendation(productId, product.stock);
    }

    // Get average lead time from suppliers
    const suppliers = await prisma.productSupplier.findMany({
      where: { productId },
      include: { supplier: true },
    });

    let averageLeadTime = 7; // Default 7 days
    if (suppliers.length > 0) {
      const totalLeadTime = suppliers.reduce((sum, ps) => {
        const leadTime = ps.leadTime || ps.supplier.leadTime;
        return sum + leadTime;
      }, 0);
      averageLeadTime = Math.ceil(totalLeadTime / suppliers.length);
    }

    // Get supplier cost
    let supplierCost = product.price * 0.4; // Default 40% of retail
    if (suppliers.length > 0) {
      const avgCost =
        suppliers.reduce((sum, ps) => sum + ps.cost, 0) / suppliers.length;
      supplierCost = avgCost;
    }

    // Calculate stock levels
    const stockLevels = calculateStockLevels(
      velocity.dailyVelocity,
      velocity.varianceDailyDemand,
      averageLeadTime
    );

    const recommendedStock = Math.max(
      stockLevels.reorderPoint,
      Math.ceil((stockLevels.minStock + stockLevels.maxStock) / 2)
    );

    // Calculate annual demand for EOQ
    const annualDemand = velocity.dailyVelocity * 365;
    const eoq = calculateEOQ(
      annualDemand,
      INVENTORY_AUTOMATION.DEFAULT_REORDER_COST,
      supplierCost * INVENTORY_AUTOMATION.DEFAULT_HOLDING_COST_PERCENT
    );

    // Create or update recommendation
    const recommendation = await prisma.stockRecommendation.upsert({
      where: { productId },
      update: {
        ...stockLevels,
        forecastedVelocity: velocity.dailyVelocity,
        leadTimeVariance: suppliers.length > 0 ? 2 : 0,
        recommendedStock,
        updatedAt: new Date(),
      },
      create: {
        productId,
        ...stockLevels,
        forecastedVelocity: velocity.dailyVelocity,
        leadTimeVariance: suppliers.length > 0 ? 2 : 0,
        recommendedStock,
        confidence: 0.95,
      },
    });

    return {
      ...recommendation,
      eoq,
      supplierCount: suppliers.length,
      averageLeadTime,
    };
  }

  /**
   * Create default recommendation for new products
   */
  private static createDefaultRecommendation(productId: string, currentStock: number) {
    const minStock = Math.max(10, Math.ceil(currentStock * 0.2));
    const maxStock = Math.ceil(currentStock * 1.5);
    const safetyStock = Math.ceil(currentStock * 0.25);
    const reorderPoint = minStock + safetyStock;

    return {
      productId,
      minStock,
      maxStock,
      safetyStock,
      reorderPoint,
      recommendedStock: Math.ceil((minStock + maxStock) / 2),
      forecastedVelocity: 0,
      confidence: 0.5, // Low confidence for new products
    };
  }

  /**
   * Generate recommendations for all products
   */
  static async generateAllRecommendations(): Promise<{
    generated: number;
    updated: number;
    failed: number;
  }> {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { id: true },
    });

    let generated = 0;
    let updated = 0;
    let failed = 0;

    for (const product of products) {
      try {
        const existing = await prisma.stockRecommendation.findUnique({
          where: { productId: product.id },
        });

        await this.generateRecommendation(product.id);

        if (existing) {
          updated++;
        } else {
          generated++;
        }
      } catch (error) {
        console.error(
          `Failed to generate recommendation for ${product.id}:`,
          error
        );
        failed++;
      }
    }

    return { generated, updated, failed };
  }

  /**
   * Apply a recommendation to a product
   * Updates product stock and creates log entry
   */
  static async applyRecommendation(
    productId: string,
    userId: string
  ) {
    const recommendation = await prisma.stockRecommendation.findUnique({
      where: { productId },
      include: { product: true },
    });

    if (!recommendation) {
      throw new Error(`No recommendation found for product ${productId}`);
    }

    const product = recommendation.product;
    const currentStock = product.stock;
    const recommendedStock = recommendation.recommendedStock;
    const difference = recommendedStock - currentStock;

    // Create inventory log
    await prisma.inventoryLog.create({
      data: {
        productId,
        previousStock: currentStock,
        newStock: recommendedStock,
        change: difference,
        reason: `Stock recommendation applied (Recommended: ${recommendedStock}, Previous: ${currentStock})`,
      },
    });

    // Update product stock
    await prisma.product.update({
      where: { id: productId },
      data: {
        stock: recommendedStock,
        inStock: recommendedStock > 0,
        updatedAt: new Date(),
      },
    });

    // Mark recommendation as applied
    await prisma.stockRecommendation.update({
      where: { productId },
      data: { appliedAt: new Date() },
    });

    return {
      productId,
      previousStock: currentStock,
      newStock: recommendedStock,
      change: difference,
      appliedAt: new Date(),
    };
  }

  /**
   * Top recommendations sorted by urgency (reorder point)
   */
  static async getTopRecommendations(limit: number = 8) {
    const recommendations = await prisma.stockRecommendation.findMany({
      take: limit,
      orderBy: { reorderPoint: 'desc' },
      include: {
        product: { select: { id: true, name: true, sku: true, stock: true } },
      },
    });

    return recommendations.map((rec) => ({
      productId: rec.productId,
      product: rec.product,
      recommendedStock: rec.recommendedStock,
      reorderPoint: rec.reorderPoint,
      safetyStock: rec.safetyStock,
      confidence: rec.confidence,
      updatedAt: rec.updatedAt,
    }));
  }

  /**
   * Get all recommendations with related product data
   */
  static async getAllRecommendations(filters?: {
    appliedOnly?: boolean;
    minDifference?: number;
  }) {
    const where: any = {};

    if (filters?.appliedOnly) {
      where.appliedAt = { not: null };
    }

    const recommendations = await prisma.stockRecommendation.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            stock: true,
            price: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Filter by minimum difference if specified
    if (filters?.minDifference) {
      return recommendations.filter(
        (rec) => Math.abs(rec.recommendedStock - rec.product.stock) >= filters.minDifference!
      );
    }

    return recommendations;
  }
}
