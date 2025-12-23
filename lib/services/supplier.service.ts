import { prisma } from '@/lib/db/prisma';

/**
 * Service for managing suppliers
 */
export class SupplierService {
  /**
   * Create a new supplier
   */
  static async createSupplier(data: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    leadTime: number;
    minOrderQuantity: number;
    costPerUnit: number;
    maxOrderQuantity?: number;
    preferredCategories?: string[];
  }) {
    return await prisma.supplier.create({
      data: {
        ...data,
        preferredCategories: data.preferredCategories || [],
      },
    });
  }

  /**
   * Get all suppliers
   */
  static async getSuppliers(filters?: {
    active?: boolean;
    categoryId?: string;
  }) {
    const where: any = {};
    if (filters?.active !== undefined) {
      where.active = filters.active;
    }

    const suppliers = await prisma.supplier.findMany({
      where,
      include: {
        productSuppliers: {
          include: { product: { select: { id: true, name: true, sku: true } } },
        },
        reorders: { select: { id: true, status: true } },
      },
      orderBy: { name: 'asc' },
    });

    // Add computed stats
    return suppliers.map((s) => ({
      ...s,
      productCount: s.productSuppliers.length,
      pendingOrders: s.reorders.filter((r) => r.status === 'PENDING' || r.status === 'ORDERED')
        .length,
    }));
  }

  /**
   * Get supplier by ID
   */
  static async getSupplierById(id: string) {
    return await prisma.supplier.findUnique({
      where: { id },
      include: {
        productSuppliers: {
          include: { product: { select: { id: true, name: true, sku: true, price: true } } },
        },
        reorders: {
          include: { product: { select: { id: true, name: true, sku: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  /**
   * Update supplier
   */
  static async updateSupplier(id: string, data: Partial<any>) {
    return await prisma.supplier.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete supplier
   */
  static async deleteSupplier(id: string) {
    // Remove all product associations first
    await prisma.productSupplier.deleteMany({
      where: { supplierId: id },
    });

    return await prisma.supplier.delete({
      where: { id },
    });
  }

  /**
   * Link product to supplier
   */
  static async linkProductToSupplier(
    productId: string,
    supplierId: string,
    data: {
      supplierSku: string;
      cost: number;
      leadTime?: number;
      preferred?: boolean;
    }
  ) {
    return await prisma.productSupplier.upsert({
      where: { productId_supplierId: { productId, supplierId } },
      create: {
        productId,
        supplierId,
        ...data,
      },
      update: data,
      include: { supplier: true, product: true },
    });
  }

  /**
   * Remove product from supplier
   */
  static async unlinkProductFromSupplier(productId: string, supplierId: string) {
    return await prisma.productSupplier.delete({
      where: { productId_supplierId: { productId, supplierId } },
    });
  }

  /**
   * Get suppliers for a product
   */
  static async getSuppliersForProduct(productId: string) {
    return await prisma.productSupplier.findMany({
      where: { productId },
      include: { supplier: true },
      orderBy: { preferred: 'desc' },
    });
  }

  /**
   * Get supplier performance metrics
   */
  static async getSupplierPerformance(supplierId: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
      include: { reorders: true },
    });

    if (!supplier) {
      throw new Error(`Supplier ${supplierId} not found`);
    }

    const reorders = supplier.reorders;
    const received = reorders.filter((r) => r.status === 'RECEIVED');
    const onTime = received.filter((r) => r.receivedAt && r.expectedAt && r.receivedAt <= r.expectedAt);

    const totalCost = received.reduce((sum, r) => sum + (r.cost || 0), 0);
    const avgLeadTime = reorders
      .filter((r) => r.receivedAt && r.orderedAt)
      .reduce((sum, r) => {
        const leadTime = (r.receivedAt!.getTime() - r.orderedAt!.getTime()) / (1000 * 60 * 60 * 24);
        return sum + leadTime;
      }, 0) / Math.max(1, reorders.filter((r) => r.receivedAt && r.orderedAt).length);

    return {
      supplierId,
      name: supplier.name,
      totalOrders: reorders.length,
      completedOrders: received.length,
      onTimeDelivery: received.length > 0 ? (onTime.length / received.length) * 100 : 0,
      averageLeadTime: avgLeadTime,
      totalSpent: totalCost,
      avgOrderValue: received.length > 0 ? totalCost / received.length : 0,
    };
  }

  /**
   * Get best supplier for a product by cost
   */
  static async getBestSupplierByCost(productId: string) {
    const suppliers = await this.getSuppliersForProduct(productId);

    if (suppliers.length === 0) {
      return null;
    }

    return suppliers.reduce((best, current) =>
      current.cost < best.cost ? current : best
    );
  }

  /**
   * Get best supplier by lead time
   */
  static async getBestSupplierByLeadTime(productId: string) {
    const suppliers = await this.getSuppliersForProduct(productId);

    if (suppliers.length === 0) {
      return null;
    }

    return suppliers.reduce((best, current) => {
      const bestLeadTime = best.leadTime || best.supplier.leadTime;
      const currentLeadTime = current.leadTime || current.supplier.leadTime;
      return currentLeadTime < bestLeadTime ? current : best;
    });
  }
}
