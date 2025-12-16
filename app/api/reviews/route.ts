import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// POST /api/reviews - Submit a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productId,
      customerName,
      customerEmail,
      rating,
      title,
      comment,
      images = [],
    } = body;

    // Validation
    if (!productId || !customerName || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, customerName, rating, comment' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (comment.length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId,
        customerName,
        customerEmail,
        rating: parseInt(rating),
        title,
        comment,
        images: Array.isArray(images) ? images : [],
        approved: true, // Auto-approve for now (can add moderation later)
        verifiedPurchase: false, // Will be set based on order history when auth is added
      },
    });

    // Update product's average rating
    const stats = await prisma.review.aggregate({
      where: { productId, approved: true },
      _avg: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: stats._avg.rating || 0,
      },
    });

    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

// PATCH /api/reviews - Mark review as helpful or report
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, action } = body; // action: 'helpful' or 'report'

    if (!reviewId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: reviewId, action' },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    let updatedReview;

    if (action === 'helpful') {
      updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          helpful: { increment: 1 },
        },
      });
    } else if (action === 'report') {
      updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          reported: true,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be "helpful" or "report"' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      review: updatedReview,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}
