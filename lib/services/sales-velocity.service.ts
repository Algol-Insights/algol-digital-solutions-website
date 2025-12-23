import { prisma } from '@/lib/db/prisma';
import { calculateDemandStdDev, INVENTORY_AUTOMATION } from '@/lib/inventory-automation-config';

/**
 * Service for calculating and tracking sales velocity
 * Velocity = units sold per time period (daily/weekly/monthly)
 */
export class SalesVelocityService {
  /**
   * Calculate daily sales velocity for a product
   * Based on OrderItem quantities within a date range
   */
  static async calculateDailyVelocity(
    productId: string,
    daysLookback: number = INVENTORY_AUTOMATION.FORECAST_LOOKBACK
  ): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysLookback);

    const orders = await prisma.orderItem.findMany({
      where: {
        productId,
        createdAt: { gte: startDate },
      },
      select: { quantity: true },
    });

    const totalUnits = orders.reduce((sum, item) => sum + item.quantity, 0);
    const dailyVelocity = totalUnits / daysLookback;

    return dailyVelocity;
  }

  /**
   * Calculate weekly sales velocity
   */
  static async calculateWeeklyVelocity(
    productId: string,
    weeksLookback: number = Math.ceil(INVENTORY_AUTOMATION.FORECAST_LOOKBACK / 7)
  ): Promise<number> {
    const daysLookback = weeksLookback * 7;
    const dailyVelocity = await this.calculateDailyVelocity(productId, daysLookback);
    return dailyVelocity * 7;
  }

  /**
   * Calculate monthly sales velocity
   */
  static async calculateMonthlyVelocity(
    productId: string,
    monthsLookback: number = 6
  ): Promise<number> {
    const daysLookback = monthsLookback * 30;
    const dailyVelocity = await this.calculateDailyVelocity(productId, daysLookback);
    return dailyVelocity * 30;
  }

  /**
   * Calculate demand standard deviation for safety stock
   */
  static async calculateDemandVariance(
    productId: string,
    daysLookback: number = INVENTORY_AUTOMATION.FORECAST_LOOKBACK
  ): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysLookback);

    // Get daily sales by date
    const orders = await prisma.orderItem.findMany({
      where: {
        productId,
        createdAt: { gte: startDate },
      },
      select: { quantity: true, createdAt: true },
    });

    // Group by day
    const dailyDemands: Record<string, number> = {};
    orders.forEach((item) => {
      const dateKey = item.createdAt.toISOString().split('T')[0];
      dailyDemands[dateKey] = (dailyDemands[dateKey] || 0) + item.quantity;
    });

    // Add zero days for days with no sales
    for (let i = 0; i < daysLookback; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      if (!dailyDemands[dateKey]) {
        dailyDemands[dateKey] = 0;
      }
    }

    const demands = Object.values(dailyDemands);
    return calculateDemandStdDev(demands);
  }

  /**
   * Update or create SalesVelocity record for a product
   */
  static async updateVelocity(productId: string): Promise<void> {
    const dailyVelocity = await this.calculateDailyVelocity(productId);
    const weeklyVelocity = await this.calculateWeeklyVelocity(productId);
    const monthlyVelocity = await this.calculateMonthlyVelocity(productId);
    const varianceDailyDemand = await this.calculateDemandVariance(productId);

    await prisma.salesVelocity.upsert({
      where: { productId },
      update: {
        dailyVelocity,
        weeklyVelocity,
        monthlyVelocity,
        varianceDailyDemand,
        lastUpdated: new Date(),
      },
      create: {
        productId,
        dailyVelocity,
        weeklyVelocity,
        monthlyVelocity,
        varianceDailyDemand,
      },
    });
  }

  /**
   * Update velocities for all products
   */
  static async updateAllVelocities(): Promise<{ updated: number; skipped: number }> {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { id: true },
    });

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      try {
        // Check if product has minimum sales history
        const firstOrder = await prisma.orderItem.findFirst({
          where: { productId: product.id },
          orderBy: { createdAt: 'asc' },
        });

        if (!firstOrder) {
          skipped++;
          continue;
        }

        const daysOld = Math.floor(
          (Date.now() - firstOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysOld < INVENTORY_AUTOMATION.MIN_FORECAST_PERIOD) {
          skipped++;
          continue;
        }

        await this.updateVelocity(product.id);
        updated++;
      } catch (error) {
        console.error(`Error updating velocity for product ${product.id}:`, error);
        skipped++;
      }
    }

    return { updated, skipped };
  }

  /**
   * Get sales velocity with forecasting
   */
  static async getVelocityWithForecast(productId: string) {
    const velocity = await prisma.salesVelocity.findUnique({
      where: { productId },
      include: { product: { select: { name: true, price: true } } },
    });

    if (!velocity) {
      return null;
    }

    return {
      ...velocity,
      forecastedDailyDemand: velocity.dailyVelocity,
      estimatedMonthlyRevenue: velocity.monthlyVelocity * velocity.product?.price,
      demandStdDev: velocity.varianceDailyDemand,
    };
  }

  /**
   * Leaderboard of fastest-moving products
   */
  static async getTopVelocities(limit: number = 8) {
    const velocities = await prisma.salesVelocity.findMany({
      take: limit,
      orderBy: { dailyVelocity: 'desc' },
      include: {
        product: { select: { id: true, name: true, sku: true, price: true } },
      },
    });

    return velocities.map((v) => ({
      productId: v.productId,
      product: v.product,
      daily: v.dailyVelocity,
      weekly: v.weeklyVelocity,
      monthly: v.monthlyVelocity,
      variance: v.varianceDailyDemand,
      updatedAt: v.lastUpdated,
    }));
  }
}
