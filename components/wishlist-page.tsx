"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Heart,
  ShoppingCart,
  X,
  Star,
  TrendingDown,
  Calendar,
  AlertCircle,
  Package
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist, type WishlistItem } from "@/lib/wishlist-store"

function WishlistCard({ item }: { item: WishlistItem }) {
  const { removeItem, moveToCart } = useWishlist()
  const [isRemoving, setIsRemoving] = useState(false)

  // Calculate price drop
  const initialPrice = item.priceHistory[0]?.price || item.price
  const priceDrop = initialPrice - item.price
  const priceDropPercent = initialPrice > 0 ? (priceDrop / initialPrice) * 100 : 0

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => removeItem(item.id), 300)
  }

  const handleMoveToCart = () => {
    moveToCart(item.id)
    // Show success toast
  }

  const daysInWishlist = Math.floor(
    (new Date().getTime() - new Date(item.addedAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isRemoving ? 0 : 1, scale: isRemoving ? 0.9 : 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Price Drop Badge */}
      {priceDropPercent > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
          <TrendingDown className="h-3 w-3" />
          {priceDropPercent.toFixed(0)}% OFF
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-4 p-4">
        {/* Product Image */}
        <div className="md:col-span-1">
          <Link href={`/products/${item.id}`}>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square hover:scale-105 transition-transform">
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-300" />
              </div>
              {!item.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white px-3 py-1 rounded text-xs font-bold">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Product Info */}
        <div className="md:col-span-2 space-y-2">
          <Link href={`/products/${item.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-brand-teal-medium transition-colors line-clamp-2">
              {item.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-teal-medium font-semibold uppercase">
              {typeof item.category === 'string' ? item.category : item.category?.name || 'Uncategorized'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{item.rating}</span>
            </div>
            <span className="text-xs text-gray-500">({item.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            Added {daysInWishlist} day{daysInWishlist !== 1 ? "s" : ""} ago
          </div>
        </div>

        {/* Price & Actions */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${item.price.toFixed(2)}
              </span>
              {item.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${item.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Price Drop Info */}
            {priceDropPercent > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                <TrendingDown className="h-4 w-4" />
                Price dropped by ${priceDrop.toFixed(2)}
              </div>
            )}

            {/* Stock Status */}
            {!item.inStock && (
              <div className="flex items-center gap-2 text-sm text-red-600 font-semibold">
                <AlertCircle className="h-4 w-4" />
                Currently unavailable
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              className="flex-1 bg-brand-teal-dark hover:bg-brand-teal-medium text-white font-semibold"
              onClick={handleMoveToCart}
              disabled={!item.inStock}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {item.inStock ? "Add to Cart" : "Unavailable"}
            </Button>
            <Link href={`/products/${item.id}`}>
              <Button
                variant="outline"
                className="border-brand-teal-dark text-brand-teal-dark hover:bg-brand-teal-dark hover:text-white"
              >
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function WishlistPage() {
  const { items, clearWishlist, getPriceDrops } = useWishlist()
  const priceDrops = getPriceDrops()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Heart className="h-16 w-16 text-gray-300" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Your Wishlist is Empty</h2>
          <p className="text-gray-600">
            Start adding products you love to your wishlist and we'll notify you of price drops!
          </p>
          <Link href="/products">
            <Button
              size="lg"
              className="bg-brand-teal-dark hover:bg-brand-teal-medium text-white font-semibold"
            >
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="h-10 w-10 fill-red-500 text-red-500" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-2">
            {items.length} item{items.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <Button
          variant="outline"
          onClick={clearWishlist}
          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
        >
          Clear All
        </Button>
      </div>

      {/* Price Drop Alert */}
      {priceDrops.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <TrendingDown className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold">Price Drop Alert! 🎉</h3>
              <p className="text-white/90 mt-1">
                {priceDrops.length} item{priceDrops.length !== 1 ? "s" : ""} in your wishlist {priceDrops.length !== 1 ? "have" : "has"} dropped in price.
                Don't miss out on these deals!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Wishlist Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <WishlistCard key={item.id} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-teal-dark">
              {items.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-teal-dark">
              ${items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Value</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {priceDrops.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Price Drops</div>
          </div>
        </div>
      </div>
    </div>
  )
}
