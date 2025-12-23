import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SalesVelocityService } from '@/lib/services/sales-velocity.service';

/**
 * GET /api/admin/inventory/sales-velocity/[id]
 * Get sales velocity for a product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const velocity = await SalesVelocityService.getVelocityWithForecast(id);

    if (!velocity) {
      return NextResponse.json(
        { error: 'No velocity data found' },
        { status: 404 }
      );
    }

    return NextResponse.json(velocity);
  } catch (error) {
    console.error('Error fetching sales velocity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch velocity' },
      { status: 500 }
    );
  }
}
