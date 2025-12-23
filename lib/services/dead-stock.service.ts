import { prisma } from '@/lib/db/prisma';
import {
  estimateDeadStockValue,
  INVENTORY_AUTOMATION,
} from '@/lib/inventory-automation-config';

/**
 * Service for detecting and managing dead stock
 */
export class DeadStockService {
  /**
   * Detect dead stock for a product
   * Products with no sales for DEAD_STOCK_DAYS
   */
  static async detectDeadStock(productId?: string) {
    const where: any = { active: true };
    if (productId) {
      where.id = productId;
    }

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        createdAt: true,
      },
    });

    const alerts: any[] = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - INVENTORY_AUTOMATION.DEAD_STOCK_DAYS);

    for (const product of products) {
      // Get last sale date
      const lastSale = await prisma.orderItem.findFirst({
        where: { productId: product.id },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });

      if (!lastSale || lastSale.createdAt < cutoffDate) {
        const lastSaleDate = lastSale?.createdAt;
        const daysWithoutSale = lastSaleDate
          ? Math.floor((Date.now() - lastSaleDate.getTime()) / (1000 * 60 * 60 * 24))
          : Math.floor((Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24));

        // Estimate dead stock value
        const { estimatedValue } = estimateDeadStockValue(
          product.stock,
          product.price * 0.4, // Assume 40% cost
          daysWithoutSale
        );

        alerts.push({
          productId: product.id,
          name: product.name,
          daysWithoutSale,
          lastSaleDate,
          currentStock: product.stock,
          estimatedValue,
        });
      }
    }

    return alerts;
  }

  /**
   * Create or update dead stock alerts for detected products
   */
  static async createOrUpdateAlerts() {
    const alerts = await this.detectDeadStock();

    let created = 0;
    let updated = 0;

    for (const alert of alerts) {
      const existing = await prisma.deadStockAlert.findUnique({
        where: { productId: alert.productId },
      });

      if (existing) {
        await prisma.deadStockAlert.update({
          where: { productId: alert.productId },
          data: {
            daysWithoutSale: alert.daysWithoutSale,
            lastSaleDate: alert.lastSaleDate,
            currentStock: alert.currentStock,
            estimatedValue: alert.estimatedValue,
            updatedAt: new Date(),
          },
        });
        updated++;
      } else {
        await prisma.deadStockAlert.create({
          data: {
            productId: alert.productId,
            daysWithoutSale: alert.daysWithoutSale,
            lastSaleDate: alert.lastSaleDate,
            currentStock: alert.currentStock,
            estimatedValue: alert.estimatedValue,
            status: 'ACTIVE',
          },
        });
        created++;
      }
    }

    return { created, updated, totalAlerts: alerts.length };
  }

  /**
   * Get all dead stock alerts with filters
   */
  static async getAlerts(filters?: {
    status?: string;
    minDaysWithoutSale?: number;
    minEstimatedValue?: number;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    let alerts = await prisma.deadStockAlert.findMany({
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
      orderBy: { estimatedValue: 'desc' },
    });

    // Filter by minimum values
    if (filters?.minDaysWithoutSale) {
      alerts = alerts.filter((a) => a.daysWithoutSale >= filters.minDaysWithoutSale!);
    }

    if (filters?.minEstimatedValue) {
      alerts = alerts.filter((a) => a.estimatedValue >= filters.minEstimatedValue!);
    }

    return alerts;
  }

  /**
   * Apply action to dead stock
   */
  static async applyAction(
    alertId: string,
    action: 'DISCOUNT' | 'BUNDLE' | 'CLEARANCE' | 'RETURN' | 'DONATE',
    notes?: string
  ) {
    const alert = await prisma.deadStockAlert.findUnique({
      where: { id: alertId },
      include: { product: true },
    });

    if (!alert) {
      throw new Error(`Alert ${alertId} not found`);
    }

    // Update alert
    const updated = await prisma.deadStockAlert.update({
      where: { id: alertId },
      data: {
        action,
        actionAt: new Date(),
        notes: notes || `Applied ${action} action`,
        status: 'REVIEWED',
      },
      include: { product: true },
    });

    // Apply action to product based on type
    if (action === 'DISCOUNT') {
      // Apply 30% discount
      const discountedPrice = updated.product.price * 0.7;
      await prisma.product.update({
        where: { id: alert.productId },
        data: { price: discountedPrice, onSale: true },
      });
    } else if (action === 'CLEARANCE') {
      // Apply 70% discount
      const clearancePrice = updated.product.price * 0.3;
      await prisma.product.update({
        where: { id: alert.productId },
        data: { price: clearancePrice, onSale: true },
      });
    }
    // BUNDLE, RETURN, DONATE don't automatically change product

    return updated;
  }

  /**
   * Archive reviewed alerts
   */
  static async archiveReviewed() {
    const result = await prisma.deadStockAlert.updateMany({
      where: { status: 'REVIEWED' },
      data: { status: 'ARCHIVED' },
    });

    return result.count;
  }

  /**
   * Get dead stock statistics
   */
  static async getStats() {
    const [activeCount, reviewedCount, archivedCount, delistedCount, totalValue] =
      await Promise.all([
        prisma.deadStockAlert.count({ where: { status: 'ACTIVE' } }),
        prisma.deadStockAlert.count({ where: { status: 'REVIEWED' } }),
        prisma.deadStockAlert.count({ where: { status: 'ARCHIVED' } }),
        prisma.deadStockAlert.count({ where: { status: 'DELISTED' } }),
        prisma.deadStockAlert.aggregate({
          _sum: { estimatedValue: true },
        }),
      ]);

    return {
      active: activeCount,
      reviewed: reviewedCount,
      archived: archivedCount,
      delisted: delistedCount,
      total: activeCount + reviewedCount + archivedCount + delistedCount,
      totalEstimatedValue: totalValue._sum.estimatedValue || 0,
    };
  }

  /**
   * Get products eligible for clearance
   * Products with 90+ days no sales and stock > 10 units
   */
  static async getClearanceCandidates() {
    const alerts = await this.getAlerts({
      status: 'ACTIVE',
      minDaysWithoutSale: 90,
    });

    return alerts.filter((a) => a.currentStock > 10);
  }

  /**
   * Delist a product from catalog
   */
  static async delistProduct(alertId: string) {
    const alert = await prisma.deadStockAlert.findUnique({
      where: { id: alertId },
    });

    if (!alert) {
      throw new Error(`Alert ${alertId} not found`);
    }

    // Update alert and product
    await Promise.all([
      prisma.deadStockAlert.update({
        where: { id: alertId },
        data: { status: 'DELISTED', actionAt: new Date() },
      }),
      prisma.product.update({
        where: { id: alert.productId },
        data: { active: false, inStock: false },
      }),
    ]);

    return alert;
  }
}
