import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Get sales with items and totals
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        items: {
          include: {
            product: {
              select: { name: true, brand: true },
            },
          },
        },
        createdByUser: {
          select: { name: true, email: true },
        },
      },
    });

    const total = await prisma.sale.count();

    // Calculate revenue stats
    const stats = await prisma.sale.aggregate({
      _sum: { total: true },
      _count: true,
    });

    return NextResponse.json({
      sales,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
      stats: {
        totalSales: stats._count || 0,
        totalRevenue: stats._sum.total || 0,
      },
    });
  } catch (error) {
    console.error('Sales fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}
