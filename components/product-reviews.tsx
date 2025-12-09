'use client'

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import { submitProductReview, getRatingDistribution } from '@/lib/product-reviews'

interface ReviewsProps {
  productId: string
  summary: any
  reviews: any[]
}

export function ProductReviews({ productId, summary, reviews }: ReviewsProps) {
  const [sortBy, setSortBy] = useState('helpful')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    content: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      const result = await submitProductReview(productId, {
        customerName: formData.name,
        customerEmail: formData.email,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
      })

      if (result.success) {
        setMessage(result.message)
        setFormData({ name: '', email: '', rating: 5, title: '', content: '' })
        setShowForm(false)
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      setMessage('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const distribution = getRatingDistribution(summary)
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful
    if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime()
    return b.rating - a.rating
  })

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-foreground mb-2">{summary.averageRating}</div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(summary.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Based on {summary.totalReviews} reviews</p>
            <p className="text-xs text-green-600 mt-2">
              ✓ {summary.verifiedPurchases} verified purchases
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2 space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  {rating} <Star className="w-4 h-4" />
                </button>
                <div className="flex-1 h-2 bg-secondary rounded-full">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${distribution[rating as keyof typeof distribution]}%` }}></div>
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {summary.ratingBreakdown[rating as keyof typeof summary.ratingBreakdown]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Share Your Review</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <div className={`p-4 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 border border-green-200 dark:border-green-800' : 'bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800'}`}>
                {message}
              </div>
            )}

            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                required
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className="transition"
                  >
                    <Star
                      className={`w-6 h-6 ${formData.rating >= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <input
              type="text"
              placeholder="Review Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
              required
            />

            {/* Content */}
            <textarea
              placeholder="Share your experience with this product..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
              required
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-secondary text-foreground py-2 rounded-lg font-medium hover:opacity-80"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {/* Sort Options */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 bg-card border border-border rounded text-sm"
          >
            <option value="helpful">Most Helpful</option>
            <option value="newest">Newest</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Reviews */}
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <h4 className="font-semibold text-foreground">{review.title}</h4>
                <p className="text-sm text-muted-foreground">
                  By {review.customerName} on {new Date(review.date).toLocaleDateString()}
                  {review.verified && <span className="ml-2 text-green-600">✓ Verified Purchase</span>}
                </p>
              </div>
            </div>

            <p className="text-foreground mb-4">{review.content}</p>

            {/* Helpful Buttons */}
            <div className="flex gap-4 text-sm">
              <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition">
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.helpful})
              </button>
              <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition">
                <ThumbsDown className="w-4 h-4" />
                Not Helpful ({review.unhelpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
