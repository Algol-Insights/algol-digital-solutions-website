import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user?.id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
    }

    const { items, customerId, discount, discountType, paymentMethod, notes } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in sale' }, { status: 400 });
    }

    // Generate transaction number
    const transactionNo = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Calculate total
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.quantity * item.unitPrice;
    }

    let finalTotal = subtotal;
    if (discountType === 'PERCENTAGE') {
      finalTotal -= (subtotal * discount) / 100;
    } else {
      finalTotal -= discount;
    }

    // Create sale
    const sale = await prisma.sale.create({
      data: {
        transactionNo,
        customerId: customerId || null,
        total: Math.max(0, finalTotal),
        discount,
        discountType,
        paymentMethod,
        paymentStatus: 'COMPLETED',
        notes,
        createdBy: session.user.id!,
        completedAt: new Date(),
      },
    });

    // Create sale items and update product stock
    for (const item of items) {
      // Create sale item
      await prisma.saleItem.create({
        data: {
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        },
      });

      // Deduct from product stock
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      // Update inStock status if stock is 0
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true },
      });

      if (product && product.stock === 0) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { inStock: false },
        });
      }
    }

    return NextResponse.json({
      success: true,
      transactionNo: sale.transactionNo,
      saleId: sale.id,
      total: sale.total,
    });
  } catch (error) {
    console.error('Sale recording error:', error);
    return NextResponse.json(
      { error: 'Failed to record sale' },
      { status: 500 }
    );
  }
}
