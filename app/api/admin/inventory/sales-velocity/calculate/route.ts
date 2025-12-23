import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SalesVelocityService } from '@/lib/services/sales-velocity.service';

/**
 * POST /api/admin/inventory/sales-velocity/calculate
 * Calculate or update all sales velocities
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await SalesVelocityService.updateAllVelocities();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating velocities:', error);
    return NextResponse.json(
      { error: 'Failed to calculate velocities' },
      { status: 500 }
    );
  }
}
