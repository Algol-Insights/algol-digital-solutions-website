"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useSaveForLaterStore } from "@/lib/save-for-later-store"
import { useCartStore } from "@/lib/cart-store"
import { Heart, ShoppingCart, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui-lib"

export function SaveForLaterSection() {
  const { items, removeItem, clearAll } = useSaveForLaterStore()
  const { addItem: addToCart } = useCartStore()

  const handleMoveToCart = (product: any) => {
    addToCart(product)
    removeItem(product.id)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg">
            <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Saved for Later</h2>
            <p className="text-sm text-muted-foreground">{items.length} items</p>
          </div>
        </div>
        <button
          onClick={clearAll}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow group"
          >
            {/* Product Image */}
            <Link href={`/products/${item.id}`} className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              </div>
            </Link>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.id}`}
                className="font-semibold hover:text-brand-teal-medium transition-colors line-clamp-2 mb-1"
              >
                {item.name}
              </Link>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">{item.brand}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{typeof item.category === 'string' ? item.category : (item.category as any)?.name || ''}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-brand-teal-medium">
                  ${item.price.toFixed(2)}
                </span>
                {item.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${item.originalPrice.toFixed(2)}
                  </span>
                )}
                {item.inStock ? (
                  <span className="text-sm text-green-600 dark:text-green-400">In Stock</span>
                ) : (
                  <span className="text-sm text-red-600 dark:text-red-400">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 justify-center">
              <Button
                onClick={() => handleMoveToCart(item)}
                disabled={!item.inStock}
                size="sm"
                className="bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal-medium whitespace-nowrap"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Move to Cart
              </Button>
              <button
                onClick={() => removeItem(item.id)}
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                <X className="h-4 w-4 inline mr-1" />
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Button to save from cart
interface SaveForLaterButtonProps {
  product: any
  onSaved?: () => void
  className?: string
}

export function SaveForLaterButton({ product, onSaved, className = "" }: SaveForLaterButtonProps) {
  const { addItem } = useSaveForLaterStore()

  const handleSave = () => {
    addItem(product)
    onSaved?.()
  }

  return (
    <button
      onClick={handleSave}
      className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors ${className}`}
    >
      <Heart className="h-4 w-4" />
      Save for Later
    </button>
  )
}
