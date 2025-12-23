import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AutoReorderService } from '@/lib/services/auto-reorder.service';

/**
 * POST /api/admin/inventory/automation/trigger
 * Run a full auto-reorder sweep across all products
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await AutoReorderService.checkAllProductsForReorder();
    return NextResponse.json({ ...result, runAt: new Date() });
  } catch (error) {
    console.error('Error triggering auto-reorder sweep:', error);
    return NextResponse.json({ error: 'Failed to trigger auto-reorder' }, { status: 500 });
  }
}
