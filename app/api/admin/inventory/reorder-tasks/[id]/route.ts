import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AutoReorderService } from '@/lib/services/auto-reorder.service';

/**
 * PUT /api/admin/inventory/reorder-tasks/[id]
 * Update reorder task status
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
    const { status, notes } = await request.json();

    const task = await AutoReorderService.updateReorderStatus(id, status, notes);
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating reorder task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
