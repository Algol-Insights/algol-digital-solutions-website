/**
 * Product reviews and ratings system
 */

export interface ProductReview {
  id: string
  productId: string
  customerName: string
  customerEmail: string
  rating: number // 1-5
  title: string
  content: string
  verified: boolean
  helpful: number
  unhelpful: number
  date: Date
  status: 'approved' | 'pending' | 'rejected'
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingBreakdown: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  verifiedPurchases: number
}

// Mock reviews database
const mockReviews: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    rating: 5,
    title: 'Excellent laptop!',
    content: 'This laptop is amazing. Great performance, beautiful display, and amazing battery life.',
    verified: true,
    helpful: 24,
    unhelpful: 2,
    date: new Date('2024-12-01'),
    status: 'approved',
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    rating: 4,
    title: 'Very good, minor issues',
    content: 'Great laptop overall. The only issue is it gets a bit warm during intensive tasks.',
    verified: true,
    helpful: 15,
    unhelpful: 1,
    date: new Date('2024-11-28'),
    status: 'approved',
  },
  {
    id: 'rev-3',
    productId: 'prod-1',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    rating: 5,
    title: 'Best purchase ever!',
    content: 'Exceeded my expectations. Highly recommend this product.',
    verified: true,
    helpful: 12,
    unhelpful: 0,
    date: new Date('2024-11-15'),
    status: 'approved',
  },
]

/**
 * Get reviews for a product
 */
export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  // In production, fetch from database
  return mockReviews.filter((r) => r.productId === productId && r.status === 'approved')
}

/**
 * Get review summary for a product
 */
export async function getReviewSummary(productId: string): Promise<ReviewSummary> {
  const reviews = await getProductReviews(productId)

  const ratingBreakdown = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  }

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

  const verifiedPurchases = reviews.filter((r) => r.verified).length

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
    ratingBreakdown,
    verifiedPurchases,
  }
}

/**
 * Submit a product review
 */
export async function submitProductReview(
  productId: string,
  data: {
    customerName: string
    customerEmail: string
    rating: number
    title: string
    content: string
  },
): Promise<{ success: boolean; message: string; reviewId?: string }> {
  // Validation
  if (!data.customerName || !data.customerEmail || !data.title || !data.content) {
    return { success: false, message: 'All fields are required' }
  }

  if (data.rating < 1 || data.rating > 5) {
    return { success: false, message: 'Rating must be between 1 and 5' }
  }

  if (data.content.length < 10) {
    return { success: false, message: 'Review must be at least 10 characters' }
  }

  // In production, save to database
  const reviewId = `rev-${Date.now()}`
  mockReviews.push({
    id: reviewId,
    productId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    rating: data.rating,
    title: data.title,
    content: data.content,
    verified: false, // Will be marked verified after purchase verification
    helpful: 0,
    unhelpful: 0,
    date: new Date(),
    status: 'pending', // Needs admin approval
  })

  return {
    success: true,
    message: 'Review submitted successfully. It will appear after approval.',
    reviewId,
  }
}

/**
 * Mark review as helpful
 */
export async function markReviewHelpful(reviewId: string, helpful: boolean): Promise<void> {
  const review = mockReviews.find((r) => r.id === reviewId)
  if (review) {
    if (helpful) {
      review.helpful += 1
    } else {
      review.unhelpful += 1
    }
  }
}

/**
 * Get rating distribution percentage
 */
export function getRatingDistribution(summary: ReviewSummary): Record<number, number> {
  if (summary.totalReviews === 0) {
    return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  }

  return {
    5: Math.round((summary.ratingBreakdown[5] / summary.totalReviews) * 100),
    4: Math.round((summary.ratingBreakdown[4] / summary.totalReviews) * 100),
    3: Math.round((summary.ratingBreakdown[3] / summary.totalReviews) * 100),
    2: Math.round((summary.ratingBreakdown[2] / summary.totalReviews) * 100),
    1: Math.round((summary.ratingBreakdown[1] / summary.totalReviews) * 100),
  }
}

/**
 * Generate review rating stars
 */
export function generateStarRating(rating: number): string {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  return '★'.repeat(fullStars) + (hasHalf ? '½' : '') + '☆'.repeat(emptyStars)
}
