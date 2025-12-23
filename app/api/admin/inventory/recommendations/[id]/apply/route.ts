import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { StockRecommendationService } from '@/lib/services/stock-recommendation.service';

/**
 * PUT /api/admin/inventory/recommendations/[id]/apply
 * Apply a recommendation to update product stock
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
    const userId = (session.user as any)?.id || 'system';
    const result = await StockRecommendationService.applyRecommendation(id, userId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error applying recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to apply recommendation' },
      { status: 500 }
    );
  }
}
