import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AutoReorderService } from '@/lib/services/auto-reorder.service';

/**
 * GET /api/admin/inventory/reorder-tasks
 * Get all reorder tasks
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || undefined;
    const productId = url.searchParams.get('productId') || undefined;
    const supplierId = url.searchParams.get('supplierId') || undefined;

    const tasks = await AutoReorderService.getReorderTasks({
      status,
      productId,
      supplierId,
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching reorder tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/inventory/reorder-tasks
 * Create a reorder task
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, reason } = await request.json();
    const task = await AutoReorderService.triggerReorder(
      productId,
      reason || 'MANUAL'
    );

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating reorder task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
