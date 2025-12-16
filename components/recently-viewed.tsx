"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Product } from "@/lib/cart-store"
import { ProductCard } from "@/components/product-card"
import { Clock } from "lucide-react"

const RECENTLY_VIEWED_KEY = "recently-viewed-products"
const MAX_RECENTLY_VIEWED = 12

export function useRecentlyViewed() {
  const addToRecentlyViewed = (product: Product) => {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY)
      const recentlyViewed: Product[] = stored ? JSON.parse(stored) : []

      // Remove if already exists
      const filtered = recentlyViewed.filter((p) => p.id !== product.id)

      // Add to beginning
      const updated = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED)

      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error("Error saving recently viewed:", error)
    }
  }

  const getRecentlyViewed = (): Product[] => {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading recently viewed:", error)
      return []
    }
  }

  const clearRecentlyViewed = () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(RECENTLY_VIEWED_KEY)
  }

  return {
    addToRecentlyViewed,
    getRecentlyViewed,
    clearRecentlyViewed,
  }
}

interface RecentlyViewedSectionProps {
  currentProductId?: string
  limit?: number
}

export function RecentlyViewedSection({ currentProductId, limit = 8 }: RecentlyViewedSectionProps) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
  const { getRecentlyViewed } = useRecentlyViewed()

  useEffect(() => {
    const products = getRecentlyViewed()
    // Filter out current product if viewing product detail page
    const filtered = currentProductId
      ? products.filter((p) => p.id !== currentProductId)
      : products
    setRecentlyViewed(filtered.slice(0, limit))
  }, [currentProductId, limit])

  if (recentlyViewed.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl">
          <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Recently Viewed
          </h2>
          <p className="text-sm text-muted-foreground">Products you've checked out recently</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentlyViewed.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  )
}
