import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AutoReorderService } from '@/lib/services/auto-reorder.service';
import { DeadStockService } from '@/lib/services/dead-stock.service';
import { SalesVelocityService } from '@/lib/services/sales-velocity.service';
import { StockRecommendationService } from '@/lib/services/stock-recommendation.service';

/**
 * GET /api/admin/inventory/automation/stats
 * Get inventory automation statistics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [reorderStats, deadStockStats, velocityLeaderboard, topRecommendations] =
      await Promise.all([
        AutoReorderService.getReorderStats(),
        DeadStockService.getStats(),
        SalesVelocityService.getTopVelocities(8),
        StockRecommendationService.getTopRecommendations(8),
      ]);

    return NextResponse.json({
      reorder: reorderStats,
      deadStock: deadStockStats,
      velocityLeaderboard,
      recommendations: topRecommendations,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error fetching automation stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
