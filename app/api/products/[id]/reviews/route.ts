import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/products/[id]/reviews - Fetch reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'date'; // date, rating, helpful
    const ratingFilter = searchParams.get('rating'); // 1-5 star filter

    // Build where clause
    const where: any = {
      productId: id,
      approved: true, // Only show approved reviews
    };

    if (ratingFilter) {
      where.rating = parseInt(ratingFilter);
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'helpful':
        orderBy = { helpful: 'desc' };
        break;
      case 'date':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Fetch reviews with pagination
    const [reviews, totalCount, stats] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where: { productId: id, approved: true },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    // Get rating breakdown (count per star rating)
    const ratingBreakdown = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId: id, approved: true },
      _count: { rating: true },
    });

    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    ratingBreakdown.forEach((item) => {
      ratingCounts[item.rating as keyof typeof ratingCounts] = item._count.rating;
    });

    return NextResponse.json({
      reviews,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      stats: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.rating || 0,
        ratingBreakdown: ratingCounts,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
