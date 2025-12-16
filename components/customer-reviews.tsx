"use client"

import * as React from "react"
import { Star, ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui-lib"

interface Review {
  id: string
  author: string
  rating: number
  date: string
  verified: boolean
  title: string
  content: string
  helpful: number
  images?: string[]
}

interface ProductReviewsProps {
  productId: string
  reviews?: Review[]
}

// Sample reviews for demonstration
const sampleReviews: Review[] = [
  {
    id: "1",
    author: "Tafadzwa M.",
    rating: 5,
    date: "2024-01-15",
    verified: true,
    title: "Excellent laptop for the price!",
    content: "This laptop exceeded my expectations. Fast delivery within Harare, great performance for work and entertainment. The Dell quality is evident. Highly recommend Algol Digital!",
    helpful: 12,
  },
  {
    id: "2",
    author: "Rudo K.",
    rating: 4,
    date: "2024-01-10",
    verified: true,
    title: "Great value, minor heating issue",
    content: "Overall very satisfied with the purchase. The specs are as advertised and performance is solid. Only issue is it gets a bit warm during heavy use. Customer service was responsive.",
    helpful: 8,
  },
  {
    id: "3",
    author: "Tendai P.",
    rating: 5,
    date: "2024-01-05",
    verified: false,
    title: "Perfect for students",
    content: "Bought this for university and it's perfect. Battery lasts through long lectures, lightweight for carrying around campus. The free delivery made it even better!",
    helpful: 5,
  },
]

export function ProductReviewsSection({ productId, reviews = sampleReviews }: ProductReviewsProps) {
  const [sortBy, setSortBy] = React.useState<"recent" | "helpful" | "rating">("recent")
  const [filterRating, setFilterRating] = React.useState<number | null>(null)

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }))

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "helpful") return b.helpful - a.helpful
    if (sortBy === "rating") return b.rating - a.rating
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const filteredReviews = filterRating
    ? sortedReviews.filter((r) => r.rating === filterRating)
    : sortedReviews

  return (
    <div className="space-y-8">
      {/* Ratings Overview */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-brand-teal-medium/10 to-brand-golden/10 rounded-2xl border border-border">
          <div className="text-6xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.round(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Based on {reviews.length} reviews</div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <button
              key={rating}
              onClick={() => setFilterRating(filterRating === rating ? null : rating)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors ${
                filterRating === rating ? "bg-muted" : ""
              }`}
            >
              <div className="flex items-center gap-1 w-24">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: rating * 0.1 }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                />
              </div>
              <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort and Filter */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-xl font-bold">Customer Reviews</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 border border-border rounded-lg bg-background text-sm"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No reviews match your filter
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))
        )}
      </div>
    </div>
  )
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [helpful, setHelpful] = React.useState(review.helpful)
  const [voted, setVoted] = React.useState(false)

  const handleHelpful = () => {
    if (!voted) {
      setHelpful((prev) => prev + 1)
      setVoted(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 border border-border rounded-xl hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{review.author}</span>
            {review.verified && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                Verified Purchase
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {new Date(review.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <h4 className="font-semibold mb-2">{review.title}</h4>
      <p className="text-sm text-muted-foreground mb-4">{review.content}</p>

      {/* Helpful Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">Was this helpful?</span>
        <Button
          onClick={handleHelpful}
          disabled={voted}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ThumbsUp className="h-4 w-4" />
          Yes ({helpful})
        </Button>
      </div>
    </motion.div>
  )
}

// Star rating input component for adding reviews
export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
}: {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
}) {
  const [hoverRating, setHoverRating] = React.useState(0)

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          onClick={() => onRatingChange?.(i + 1)}
          onMouseEnter={() => !readonly && setHoverRating(i + 1)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            className={`h-6 w-6 ${
              i < (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  )
}
