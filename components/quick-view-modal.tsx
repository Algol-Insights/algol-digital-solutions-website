"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, Heart, Star, Minus, Plus, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui-lib"
import type { Product } from "@/lib/cart-store"
import { useCartStore } from "@/lib/cart-store"
import { useWishlistStore } from "@/lib/wishlist-store"

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore()

  if (!product) return null

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      setQuantity(1)
    }, 2000)
  }

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({ ...product, inStock: product.inStock ?? true } as any)
    }
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid md:grid-cols-2 gap-8 p-8">
                  {/* Left: Image */}
                  <div className="relative">
                    <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {discount > 0 && (
                        <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold shadow-lg">
                          -{discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="flex flex-col space-y-6">
                    {/* Header */}
                    <div>
                      <p className="text-sm text-brand-teal-medium font-semibold uppercase mb-1">
                        {product.brand}
                      </p>
                      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">4.8 (124 reviews)</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <>
                          <span className="text-lg text-slate-500 line-through">
                            ${product.originalPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-green-600 font-semibold">
                            Save ${(product.originalPrice - product.price).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {product.description}
                    </p>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
                      <span className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Quantity:</span>
                      <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleAddToCart}
                        disabled={!product.inStock || added}
                        className={`flex-1 ${
                          added
                            ? "bg-green-600 hover:bg-green-600"
                            : "bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal-medium"
                        }`}
                        size="lg"
                      >
                        {added ? (
                          <>
                            <Check className="mr-2 h-5 w-5" />
                            Added!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleWishlistToggle}
                        variant="outline"
                        size="lg"
                        className={inWishlist ? "bg-red-50 border-red-300 text-red-600" : ""}
                      >
                        <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
                      </Button>
                    </div>

                    {/* View Full Details Link */}
                    <Link
                      href={`/products/${product.id}`}
                      className="flex items-center justify-center gap-2 text-brand-teal-medium hover:text-brand-teal-dark transition-colors font-medium"
                      onClick={onClose}
                    >
                      View Full Details
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
