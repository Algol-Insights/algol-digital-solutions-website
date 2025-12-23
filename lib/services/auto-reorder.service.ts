import { prisma } from '@/lib/db/prisma';
import { INVENTORY_AUTOMATION } from '@/lib/inventory-automation-config';

/**
 * Service for automated reorder triggering and management
 */
export class AutoReorderService {
  /**
   * Check if product needs reorder based on stock level
   */
  static async shouldReorder(productId: string): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { stockRecommendation: true },
    });

    if (!product) {
      return false;
    }

    // Get reorder point from recommendation
    const reorderPoint = product.stockRecommendation?.reorderPoint || Math.ceil(product.stock * 0.3);

    // Check if already has pending reorder
    const pendingReorder = await prisma.reorderTask.findFirst({
      where: {
        productId,
        status: { in: ['PENDING', 'ORDERED'] },
      },
    });

    if (pendingReorder) {
      return false; // Already have pending reorder
    }

    return product.stock <= reorderPoint;
  }

  /**
   * Trigger automatic reorder for a product
   */
  static async triggerReorder(
    productId: string,
    reason: 'LOW_STOCK' | 'SCHEDULED' | 'MANUAL'
  ) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { stockRecommendation: true, productSuppliers: { include: { supplier: true } } },
    });

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    // Determine order quantity
    const recommendation = product.stockRecommendation;
    let orderQuantity = 100; // Default

    if (recommendation) {
      // Order to bring stock to max
      orderQuantity = Math.max(
        recommendation.maxStock - product.stock,
        recommendation.reorderPoint * 0.5
      );
    }

    // Select best supplier
    let supplierId: string | null = null;
    let selectedSupplier = null;

    if (product.productSuppliers.length > 0) {
      // Find preferred supplier or cheapest
      const preferred = product.productSuppliers.find((ps) => ps.preferred);
      selectedSupplier = preferred || product.productSuppliers[0];
      supplierId = selectedSupplier.supplierId;
    }

    // Get lead time
    const leadTime =
      selectedSupplier?.leadTime || selectedSupplier?.supplier?.leadTime || 7;

    // Create reorder task
    const reorderTask = await prisma.reorderTask.create({
      data: {
        productId,
        supplierId,
        quantity: Math.ceil(orderQuantity),
        status: 'PENDING',
        reason,
        reorderPoint: recommendation?.reorderPoint || Math.ceil(product.stock * 0.3),
        expectedAt: new Date(Date.now() + leadTime * 24 * 60 * 60 * 1000),
        cost: selectedSupplier
          ? selectedSupplier.cost * Math.ceil(orderQuantity)
          : undefined,
      },
      include: { supplier: true, product: { select: { name: true, sku: true } } },
    });

    return reorderTask;
  }

  /**
   * Check all products for low stock and trigger reorders
   */
  static async checkAllProductsForReorder(): Promise<{
    checked: number;
    reordered: number;
    failed: number;
  }> {
    const products = await prisma.product.findMany({
      where: { active: true, inStock: true },
      select: { id: true },
    });

    let checked = 0;
    let reordered = 0;
    let failed = 0;

    for (const product of products) {
      try {
        checked++;
        if (await this.shouldReorder(product.id)) {
          await this.triggerReorder(product.id, 'LOW_STOCK');
          reordered++;
        }
      } catch (error) {
        console.error(`Failed to check reorder for ${product.id}:`, error);
        failed++;
      }
    }

    return { checked, reordered, failed };
  }

  /**
   * Update reorder task status
   */
  static async updateReorderStatus(
    reorderTaskId: string,
    status: 'PENDING' | 'ORDERED' | 'RECEIVED' | 'CANCELLED',
    notes?: string
  ) {
    const task = await prisma.reorderTask.findUnique({
      where: { id: reorderTaskId },
    });

    if (!task) {
      throw new Error(`Reorder task ${reorderTaskId} not found`);
    }

    // Update based on status
    const updateData: any = { status };

    if (status === 'ORDERED' && !task.orderedAt) {
      updateData.orderedAt = new Date();
    }

    if (status === 'RECEIVED' && !task.receivedAt) {
      updateData.receivedAt = new Date();

      // Increase product stock
      const product = await prisma.product.findUnique({
        where: { id: task.productId },
      });

      if (product) {
        const newStock = product.stock + task.quantity;
        await prisma.product.update({
          where: { id: task.productId },
          data: {
            stock: newStock,
            inStock: newStock > 0,
          },
        });

        // Create inventory log
        await prisma.inventoryLog.create({
          data: {
            productId: task.productId,
            previousStock: product.stock,
            newStock,
            change: task.quantity,
            reason: `Reorder received - Task ${task.id}`,
          },
        });
      }
    }

    if (notes) {
      updateData.notes = notes;
    }

    return await prisma.reorderTask.update({
      where: { id: reorderTaskId },
      data: updateData,
      include: { product: true, supplier: true },
    });
  }

  /**
   * Get all reorder tasks with filters
   */
  static async getReorderTasks(filters?: {
    status?: string;
    productId?: string;
    supplierId?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.productId) {
      where.productId = filters.productId;
    }
    if (filters?.supplierId) {
      where.supplierId = filters.supplierId;
    }

    return await prisma.reorderTask.findMany({
      where,
      include: {
        product: { select: { id: true, name: true, sku: true } },
        supplier: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get reorder statistics
   */
  static async getReorderStats() {
    const [pending, ordered, received, cancelled, totalCost] = await Promise.all([
      prisma.reorderTask.count({ where: { status: 'PENDING' } }),
      prisma.reorderTask.count({ where: { status: 'ORDERED' } }),
      prisma.reorderTask.count({ where: { status: 'RECEIVED' } }),
      prisma.reorderTask.count({ where: { status: 'CANCELLED' } }),
      prisma.reorderTask.aggregate({
        where: { status: { in: ['PENDING', 'ORDERED'] } },
        _sum: { cost: true },
      }),
    ]);

    return {
      pending,
      ordered,
      received,
      cancelled,
      totalPendingCost: totalCost._sum.cost || 0,
      total: pending + ordered + received + cancelled,
    };
  }
}
