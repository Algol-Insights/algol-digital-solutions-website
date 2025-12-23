import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DeadStockService } from '@/lib/services/dead-stock.service';

/**
 * PUT /api/admin/inventory/dead-stock/[id]
 * Update dead stock alert status or apply action
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { action, notes } = await request.json();

    if (!action) {
      return NextResponse.json(
        { error: 'Missing action parameter' },
        { status: 400 }
      );
    }

    const result = await DeadStockService.applyAction(id, action, notes);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating dead stock alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}
