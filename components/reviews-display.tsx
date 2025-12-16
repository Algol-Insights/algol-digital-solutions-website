'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, Flag, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui-lib/button';

interface Review {
  id: string;
  customerName: string;
  customerEmail?: string | null;
  rating: number;
  title?: string | null;
  comment: string;
  images: string[];
  verifiedPurchase: boolean;
  helpful: number;
  reported: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReviewsDisplayProps {
  productId: string;
}

export function ReviewsDisplay({ productId }: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const limit = 10;

  React.useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, filterRating, offset]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        sortBy,
      });

      if (filterRating) {
        params.append('rating', filterRating.toString());
      }

      const response = await fetch(`/api/products/${productId}/reviews?${params}`);
      const data = await response.json();

      setReviews(data.reviews);
      setStats(data.stats);
      setHasMore(data.pagination.hasMore);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    if (helpfulClicked.has(reviewId)) return;

    try {
      const response = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action: 'helpful' }),
      });

      if (response.ok) {
        setHelpfulClicked(new Set(helpfulClicked).add(reviewId));
        // Update the review in state
        setReviews(
          reviews.map((r) =>
            r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
          )
        );
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const handleReport = async (reviewId: string) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action: 'report' }),
      });

      if (response.ok) {
        alert('Review reported. Thank you for your feedback.');
      }
    } catch (error) {
      console.error('Error reporting review:', error);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'sm' ? 16 : 24;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-5xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="mt-2">{renderStars(Math.round(stats.averageRating), 'lg')}</div>
              <div className="mt-2 text-gray-600">
                Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingBreakdown[rating] || 0;
                const percentage =
                  stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

                return (
                  <button
                    key={rating}
                    onClick={() =>
                      setFilterRating(filterRating === rating ? null : rating)
                    }
                    className={`flex items-center gap-3 w-full text-left hover:bg-gray-50 p-2 rounded transition ${
                      filterRating === rating ? 'bg-teal-50 border border-teal-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 w-12 text-right">{count}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sort and Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setOffset(0);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="date">Most Recent</option>
            <option value="rating">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {filterRating && (
          <button
            onClick={() => {
              setFilterRating(null);
              setOffset(0);
            }}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500"
            >
              No reviews yet. Be the first to review this product!
            </motion.div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {review.customerName}
                      </span>
                      {review.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <CheckCircle size={12} />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Title */}
                {review.title && (
                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                )}

                {/* Review Comment */}
                <p className="text-gray-700 mb-4 whitespace-pre-line">{review.comment}</p>

                {/* Review Images */}
                {review.images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.images.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(image)}
                        className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-teal-500 transition"
                      >
                        <img
                          src={image}
                          alt={`Review image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    disabled={helpfulClicked.has(review.id)}
                    className={`flex items-center gap-2 text-sm ${
                      helpfulClicked.has(review.id)
                        ? 'text-teal-600 cursor-not-allowed'
                        : 'text-gray-600 hover:text-teal-600'
                    } transition`}
                  >
                    <ThumbsUp
                      size={16}
                      className={helpfulClicked.has(review.id) ? 'fill-teal-600' : ''}
                    />
                    Helpful ({review.helpful})
                  </button>

                  <button
                    onClick={() => handleReport(review.id)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
                  >
                    <Flag size={16} />
                    Report
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => setOffset(offset + limit)}
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Loading...' : 'Load More Reviews'}
          </Button>
        </div>
      )}

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Review image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
