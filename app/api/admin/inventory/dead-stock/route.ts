import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DeadStockService } from '@/lib/services/dead-stock.service';

/**
 * GET /api/admin/inventory/dead-stock
 * Get dead stock alerts
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || undefined;
    const minDaysWithoutSale = url.searchParams.get('minDaysWithoutSale')
      ? parseInt(url.searchParams.get('minDaysWithoutSale')!)
      : undefined;
    const minEstimatedValue = url.searchParams.get('minEstimatedValue')
      ? parseFloat(url.searchParams.get('minEstimatedValue')!)
      : undefined;

    const alerts = await DeadStockService.getAlerts({
      status,
      minDaysWithoutSale,
      minEstimatedValue,
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching dead stock alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/inventory/dead-stock
 * Detect and create/update dead stock alerts
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await DeadStockService.createOrUpdateAlerts();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error detecting dead stock:', error);
    return NextResponse.json(
      { error: 'Failed to detect dead stock' },
      { status: 500 }
    );
  }
}
