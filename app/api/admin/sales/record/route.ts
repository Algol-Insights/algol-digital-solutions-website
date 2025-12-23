import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    // Temporarily disable auth for testing
    // const session = await getServerSession(authOptions);
    // if (!session || session.user?.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { items, customerName, customerPhone, discount, discountType, paymentMethod, paymentStatus, notes, saleDate } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in sale' }, { status: 400 });
    }

    // Generate transaction number with date
    const date = new Date(saleDate || new Date())
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')
    const transactionNo = `SALE-${dateStr}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Calculate total
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.quantity * item.unitPrice;
    }

    let discountAmount = 0
    if (discount > 0) {
      if (discountType === 'PERCENTAGE') {
        discountAmount = (subtotal * discount) / 100;
      } else {
        discountAmount = discount;
      }
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    // Use a default user ID for now (first admin user)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    })

    if (!adminUser) {
      return NextResponse.json({ error: 'No admin user found' }, { status: 500 });
    }

    // Create sale
    const sale = await prisma.sale.create({
      data: {
        transactionNo,
        customerId: null, // We'll handle customer separately if needed
        total: finalTotal,
        discount: discountAmount,
        discountType,
        paymentMethod,
        paymentStatus: paymentStatus || 'COMPLETED',
        notes: notes || null,
        createdBy: adminUser.id,
        completedAt: paymentStatus === 'COMPLETED' ? new Date() : null,
        createdAt: date
      },
    });

    // Create sale items, product units, and update stock
    for (const item of items) {
      // Create sale item
      const saleItem = await prisma.saleItem.create({
        data: {
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          notes: item.serialNumber ? `Serial: ${item.serialNumber}` : null
        },
      });

      // If serial number provided, create product unit record
      if (item.serialNumber) {
        await prisma.productUnit.create({
          data: {
            productId: item.productId,
            serialNumber: item.serialNumber,
            status: 'SOLD',
            price: item.unitPrice,
            saleId: sale.id,
            soldAt: date
          }
        })
      }

      // Deduct from product stock
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, name: true },
      });

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
      }

      const newStock = product.stock - item.quantity

      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: newStock,
          inStock: newStock > 0
        },
      });

      // Log inventory change
      await prisma.inventoryLog.create({
        data: {
          productId: item.productId,
          previousStock: product.stock,
          newStock: newStock,
          change: -item.quantity,
          reason: `Sale: ${transactionNo}`
        }
      })
    }

    return NextResponse.json({
      success: true,
      transactionNo: sale.transactionNo,
      saleId: sale.id,
      total: sale.total,
      message: 'Sale recorded successfully'
    });
  } catch (error: any) {
    console.error('Sale recording error:', error);
    return NextResponse.json(
      { error: 'Failed to record sale' },
      { status: 500 }
    );
  }
}
