import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { StockRecommendationService } from '@/lib/services/stock-recommendation.service';

/**
 * GET /api/admin/inventory/recommendations
 * Get all stock recommendations
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const appliedOnly = url.searchParams.get('applied') === 'true';
    const minDifference = url.searchParams.get('minDifference')
      ? parseInt(url.searchParams.get('minDifference')!)
      : undefined;

    const recommendations = await StockRecommendationService.getAllRecommendations({
      appliedOnly,
      minDifference,
    });

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/inventory/recommendations
 * Generate or update recommendations
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    if (body.generateAll) {
      // Generate for all products
      const result = await StockRecommendationService.generateAllRecommendations();
      return NextResponse.json(result);
    } else if (body.productId) {
      // Generate for specific product
      const recommendation = await StockRecommendationService.generateRecommendation(
        body.productId
      );
      return NextResponse.json(recommendation, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Missing productId or generateAll parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
