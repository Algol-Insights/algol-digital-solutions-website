import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { productCache } from '@/lib/cache';

/**
 * POST /api/admin/system/cache/warm
 * Warms product listing cache (page 1) for faster first byte
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: limit,
      }),
      prisma.product.count({ where: { active: true } }),
    ]);

    const payload = {
      data: products,
      pagination: {
        page: 1,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },    };

    productCache.set('__all__', payload);

    return NextResponse.json({ warmed: products.length, total });
  } catch (error) {
    console.error('Error warming cache:', error);
    return NextResponse.json({ error: 'Failed to warm cache' }, { status: 500 });
  }
}
