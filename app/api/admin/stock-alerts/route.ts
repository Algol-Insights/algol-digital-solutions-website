import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// GET /api/admin/stock-alerts - Get all stock alerts (Admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const stockAlerts = await prisma.stockAlert.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            stock: true,
            inStock: true,
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            color: true,
            size: true,
            storage: true,
            stock: true,
            inStock: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { notified: 'asc' }, // Pending alerts first
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ alerts: stockAlerts });
  } catch (error) {
    console.error('Error fetching stock alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock alerts' },
      { status: 500 }
    );
  }
}
